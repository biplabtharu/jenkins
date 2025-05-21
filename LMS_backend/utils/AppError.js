module.exports = class AppError extends Error {
	constructor(message, statusCode, name) {
		super(message);
		// this.statusCode = statusCode;
		this.status =
			`${statusCode}` >= 400 && `${statusCode}` < 500 ? "fail" : "error";
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
};
