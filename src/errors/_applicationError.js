/**
 * class that other application-specific errors inherit from
 */
class ApplicationError extends Error {
  constructor(message, status = 500) {
    super();

    this.name = this.constructor.name;

    this.message = message || "Server Error";
    this.status = status;
  }
}

module.exports = ApplicationError;
