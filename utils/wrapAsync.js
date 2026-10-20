// Async error wrapper - catches rejected promises and forwards to next()
module.exports = function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
