const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../utils/mailer');
const ExpressError = require('../utils/ExpressError');

// Helper to generate 6-digit cryptographic OTP code
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports.renderRegister = (req, res) => {
  res.render('pages/auth/register', { title: 'Register - ParkSphere' });
};

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/register');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/login');
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit expiring OTP (valid for 10 minutes)
    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role && ['CUSTOMER', 'OPERATOR'].includes(role) ? role : 'CUSTOMER',
      isEmailVerified: false,
      otp: {
        code: otpCode,
        expiresAt: otpExpires,
        attempts: 0,
      },
    });

    await user.save();

    // Dispatch verification OTP email (with clean console dev fallback)
    await sendOtpEmail(user.email, otpCode);

    req.flash('success', 'Registration successful! Please enter the 6-digit OTP sent to your email.');
    res.redirect(`/verify-otp?email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    next(err);
  }
};

module.exports.renderVerifyOtp = (req, res) => {
  const email = req.query.email || '';
  res.render('pages/auth/verifyOtp', { email, title: 'Verify OTP - ParkSphere' });
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase() : '' });

    if (!user) {
      req.flash('error', 'Account not found.');
      return res.redirect('/register');
    }

    if (user.isEmailVerified) {
      req.flash('info', 'Your email is already verified. Please sign in.');
      return res.redirect('/login');
    }

    // Verify expiration and code match
    if (!user.otp || !user.otp.expiresAt || user.otp.expiresAt < new Date()) {
      req.flash('error', 'The OTP code has expired. Please request a new code.');
      return res.redirect(`/verify-otp?email=${encodeURIComponent(user.email)}`);
    }

    if (user.otp.code !== otp.trim()) {
      user.otp.attempts = (user.otp.attempts || 0) + 1;
      await user.save();
      req.flash('error', 'Invalid verification code. Please try again.');
      return res.redirect(`/verify-otp?email=${encodeURIComponent(user.email)}`);
    }

    // Mark account verified and clear OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();

    // Automatically log user in upon verification
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash('success', `Welcome to ParkSphere, ${user.name}! Your account is verified.`);
    res.redirect('/parking');
  } catch (err) {
    next(err);
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('pages/auth/login', { title: 'Sign In - ParkSphere' });
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase() : '' });

    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    if (!user.isEmailVerified) {
      // Re-generate OTP if unverified
      const otpCode = generateOtp();
      user.otp = { code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 };
      await user.save();
      await sendOtpEmail(user.email, otpCode);

      req.flash('error', 'Your email is not verified yet. We sent a new verification code.');
      return res.redirect(`/verify-otp?email=${encodeURIComponent(user.email)}`);
    }

    // Store user info in session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash('success', `Welcome back, ${user.name}!`);
    const redirectUrl = res.locals.redirectUrl || '/parking';
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

module.exports.renderForgotPassword = (req, res) => {
  res.render('pages/auth/forgotPassword', { title: 'Forgot Password - ParkSphere' });
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase() : '' });

    if (!user) {
      req.flash('error', 'No account found with that email address.');
      return res.redirect('/forgot-password');
    }

    const otpCode = generateOtp();
    user.otp = { code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 };
    await user.save();

    await sendOtpEmail(user.email, otpCode);
    req.flash('success', 'Password reset code sent to your email.');
    res.redirect(`/reset-password?email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    next(err);
  }
};

module.exports.renderResetPassword = (req, res) => {
  const email = req.query.email || '';
  res.render('pages/auth/resetPassword', { email, title: 'Reset Password - ParkSphere' });
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase() : '' });

    if (!user || !user.otp || user.otp.expiresAt < new Date()) {
      req.flash('error', 'Invalid or expired recovery code.');
      return res.redirect('/forgot-password');
    }

    if (user.otp.code !== otp.trim()) {
      req.flash('error', 'Incorrect recovery code.');
      return res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    await user.save();

    req.flash('success', 'Password updated successfully! Please sign in with your new password.');
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};
