// Wrap async route handlers to catch promises without repetitive try-catch blocks
module.exports = function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
