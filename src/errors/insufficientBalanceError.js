const ApplicationError = require("./_applicationError");

/**
 * Error for when a requested entity either doesn't exist, or is not available to the user due to access restrictions.
 */
class InsufficientBalanceError extends ApplicationError {
  constructor(message) {
    super(message || "Insufficient balance to make the payment.", 403);
  }
}

module.exports = InsufficientBalanceError;
