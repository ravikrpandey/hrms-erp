class AppError extends Error {
    constructor(message, status) {
      super();
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.message = message || 'Something went wrong. Please try again.';
      this.status = status || 500;
    }
}

class NotFoundError extends AppError {
    constructor(message) {
      super(message || 'No record found for given input', 404);
    }
}

module.exports = {
    NotFoundError,
}