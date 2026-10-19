const ExpressError = require('./utils/ExpressError');

/**
 * Authentication Middleware: Protects routes requiring user sign-in.
 * Preserves the destination URL so users return to their intended page upon login.
 */
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be signed in to perform this action.');
    return res.redirect('/login');
  }
  next();
};

/**
 * Middleware to pass saved return URL to template locals before login redirect
 */
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

/**
 * Role-Based Access Control: Operators & Admins only
 */
const isOperator = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in first.');
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'OPERATOR' && req.session.user.role !== 'ADMIN') {
    req.flash('error', 'Access restricted: Operator or Admin privileges required.');
    return res.redirect('/parking');
  }
  next();
};

/**
 * Role-Based Access Control: Platform Administrators only
 */
const isAdmin = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in first.');
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'ADMIN') {
    req.flash('error', 'Access denied: Administrator privileges required.');
    return res.redirect('/parking');
  }
  next();
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isOperator,
  isAdmin,
};
