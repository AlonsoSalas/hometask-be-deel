const ApplicationError = require("./_applicationError");

/**
 * Error for when a requested entity either doesn't exist, or is not available to the user due to access restrictions.
 */
class AuthorizationError extends ApplicationError {
  constructor(message) {
    super(message || "You are not allowed to perform this action", 403);
  }
}

module.exports = AuthorizationError;
