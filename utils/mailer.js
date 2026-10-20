// Email utility - sends 6-digit OTP codes for account verification
const nodemailer = require('nodemailer');

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// Sends OTP email or falls back to console if SMTP is not configured
const sendOtpEmail = async (email, otp) => {
  const subject = 'Your ParkSphere Verification Code';
  const text = `Your verification code for ParkSphere is: ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">ParkSphere Verification</h2>
      <p style="color: #475569; font-size: 15px;">Use the verification code below to activate your account:</p>
      <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e293b; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #64748b; font-size: 13px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"ParkSphere Team" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        text,
        html,
      });
      console.log(`[Email] Verification OTP sent successfully to ${email}`);
    } catch (err) {
      console.error(`[Email] Error sending via SMTP: ${err.message}. Showing in console:`);
      printOtpInConsole(email, otp);
    }
  } else {
    printOtpInConsole(email, otp);
  }
};

function printOtpInConsole(email, otp) {
  console.log('\n=============================================');
  console.log(`  [DEV EMAIL FALLBACK] Target: ${email}`);
  console.log(`  >>> VERIFICATION OTP CODE: ${otp} <<<`);
  console.log('=============================================\n');
}

module.exports = {
  sendOtpEmail,
};
