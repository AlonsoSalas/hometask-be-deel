const ApplicationError = require("./_applicationError");

/**
 * Error for when a requested entity either doesn't exist, or is not available to the user due to access restrictions.
 */
class EntityNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || "The requested entity was not found", 404);
  }
}

module.exports = EntityNotFoundError;
