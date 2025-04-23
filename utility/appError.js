class AppError extends Error {
  constructor() {
    super();
  }
  create(message, statusCode, statusText) {
    this.message = message;
    this.statusCode = statusCode;
    this.httpStatusText = statusText;
    return this;
  }
}
module.exports = new AppError();
