// Auth Controller: handles user registration, OTP verification, login, and logout
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../utils/mailer');
const ExpressError = require('../utils/ExpressError');

// Generate 6-digit random OTP
const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Render registration page
module.exports.renderRegister = (req, res) => {
  res.render('pages/auth/register', { title: 'Register - ParkSphere' });
};

// Handle user registration and send OTP
module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/register');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent duplicate registrations under the same email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/login');
    }

    // Hash password with bcrypt using 10 salt rounds
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate 6-digit expiring verification code (valid for 10 minutes)
    const verificationCode = generateOtpCode();
    const codeExpirationTime = new Date(Date.now() + 10 * 60 * 1000);

    // Instantiate unverified user record
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role && ['CUSTOMER', 'OPERATOR'].includes(role) ? role : 'CUSTOMER',
      isEmailVerified: false,
      otp: {
        code: verificationCode,
        expiresAt: codeExpirationTime,
        attempts: 0,
      },
    });

    await newUser.save();

    // Dispatch verification OTP email (with clean console dev fallback)
    await sendOtpEmail(newUser.email, verificationCode);

    req.flash(
      'success',
      'Registration successful! Please enter the 6-digit OTP sent to your email.'
    );
    res.redirect(`/verify-otp?email=${encodeURIComponent(newUser.email)}`);
  } catch (error) {
    next(error);
  }
};

// Render OTP verification page
module.exports.renderVerifyOtp = (req, res) => {
  const emailParam = req.query.email || '';
  res.render('pages/auth/verifyOtp', {
    email: emailParam,
    title: 'Verify OTP - ParkSphere',
  });
};

// Verify OTP and activate account
module.exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    const targetUser = await User.findOne({ email: normalizedEmail });

    if (!targetUser) {
      req.flash('error', 'Account not found.');
      return res.redirect('/register');
    }

    if (targetUser.isEmailVerified) {
      req.flash('info', 'Your email is already verified. Please sign in.');
      return res.redirect('/login');
    }

    // Check if OTP expired
    if (
      !targetUser.otp ||
      !targetUser.otp.expiresAt ||
      targetUser.otp.expiresAt < new Date()
    ) {
      req.flash('error', 'The OTP code has expired. Please request a new code.');
      return res.redirect(`/verify-otp?email=${encodeURIComponent(targetUser.email)}`);
    }

    // Check code match
    if (targetUser.otp.code !== otp.trim()) {
      targetUser.otp.attempts = (targetUser.otp.attempts || 0) + 1;
      await targetUser.save();
      req.flash('error', 'Invalid verification code. Please try again.');
      return res.redirect(`/verify-otp?email=${encodeURIComponent(targetUser.email)}`);
    }

    // Activate account
    targetUser.isEmailVerified = true;
    targetUser.otp = undefined;
    await targetUser.save();

    // Log user in
    req.session.user = {
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
    };

    req.flash(
      'success',
      `Welcome to ParkSphere, ${targetUser.name}! Your account is verified.`
    );

    req.session.save((err) => {
      if (err) return next(err);
      res.redirect('/parking');
    });
  } catch (error) {
    next(error);
  }
};

// Render login page
module.exports.renderLogin = (req, res) => {
  res.render('pages/auth/login', { title: 'Sign In - ParkSphere' });
};

// Handle login
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // Verify password with bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // If unverified, resend OTP
    if (!user.isEmailVerified) {
      const freshOtp = generateOtpCode();
      user.otp = {
        code: freshOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      };
      await user.save();
      await sendOtpEmail(user.email, freshOtp);

      req.flash(
        'error',
        'Your email is not verified yet. We sent a new verification code.'
      );
      return res.redirect(`/verify-otp?email=${encodeURIComponent(user.email)}`);
    }

    // Set session user
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash('success', `Welcome back, ${user.name}!`);

    // Redirect to intended page or catalog
    const destinationUrl = res.locals.redirectUrl || '/parking';
    delete req.session.redirectUrl;

    req.session.save((err) => {
      if (err) return next(err);
      res.redirect(destinationUrl);
    });
  } catch (error) {
    next(error);
  }
};

// Handle logout
module.exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
