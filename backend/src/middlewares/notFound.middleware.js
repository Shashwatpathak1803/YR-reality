import { HTTP_STATUS } from '../constants/httpStatus.js';

export const notFound = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    data: null,
  });
};
