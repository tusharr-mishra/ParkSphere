// Auth routes: register, verify OTP, login, and logout
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');

// Registration routes
router
  .route('/register')
  .get(authController.renderRegister)
  .post(wrapAsync(authController.register));

// 6-digit email OTP verification (GET form / POST handler)
router
  .route('/verify-otp')
  .get(authController.renderVerifyOtp)
  .post(wrapAsync(authController.verifyOtp));

// User login (GET form / POST handler with redirect URL preservation)
router
  .route('/login')
  .get(saveRedirectUrl, authController.renderLogin)
  .post(saveRedirectUrl, wrapAsync(authController.login));

// User logout (terminates session)
router.get('/logout', authController.logout);

module.exports = router;
