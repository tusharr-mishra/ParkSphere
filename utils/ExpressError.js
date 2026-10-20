// Custom error class to attach HTTP status codes to errors
class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode || 500;
    this.message = message || 'Something went wrong!';
  }
}

module.exports = ExpressError;
