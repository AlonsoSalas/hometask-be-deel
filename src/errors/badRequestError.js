const ApplicationError = require("./_applicationError");

/**
 * Error for when a request doesn't have all the required query strings/params/body properties.
 */
class BadRequestError extends ApplicationError {
  constructor(message) {
    super(message || "Bad request", 400);
  }
}

module.exports = BadRequestError;
