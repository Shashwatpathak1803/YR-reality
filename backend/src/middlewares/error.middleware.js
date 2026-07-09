import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = error.message || 'Internal Server Error';

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = `Invalid value for field: ${error.path}`;
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      statusCode = HTTP_STATUS.CONFLICT;
      const field = Object.keys(error.keyValue || {})[0];
      message = `Duplicate value for field: ${field}`;
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = Object.values(error.errors).map((e) => e.message).join(', ');
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = HTTP_STATUS.UNAUTHORIZED;
      message = 'Invalid token';
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = HTTP_STATUS.UNAUTHORIZED;
      message = 'Token expired';
    }

    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    data: null,
  };

  if (env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};
