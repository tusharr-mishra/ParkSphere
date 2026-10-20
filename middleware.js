// Middleware: authentication and role-based access control guards
const ExpressError = require('./utils/ExpressError');

// Ensure user is signed in, preserving original destination URL
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be signed in to perform this action.');
    return res.redirect('/login');
  }
  next();
};

// Expose return URL to template locals
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Check if user is an Operator or Admin
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

// Check if user is an Admin
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
