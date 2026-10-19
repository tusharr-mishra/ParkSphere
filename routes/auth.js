const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');

router
  .route('/register')
  .get(authController.renderRegister)
  .post(wrapAsync(authController.register));

router
  .route('/verify-otp')
  .get(authController.renderVerifyOtp)
  .post(wrapAsync(authController.verifyOtp));

router
  .route('/login')
  .get(saveRedirectUrl, authController.renderLogin)
  .post(saveRedirectUrl, wrapAsync(authController.login));

router.get('/logout', authController.logout);

router
  .route('/forgot-password')
  .get(authController.renderForgotPassword)
  .post(wrapAsync(authController.forgotPassword));

router
  .route('/reset-password')
  .get(authController.renderResetPassword)
  .post(wrapAsync(authController.resetPassword));

module.exports = router;
