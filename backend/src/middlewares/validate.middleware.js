import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Runs after express-validator chains; collects and formats errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  throw new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', formatted);
};
