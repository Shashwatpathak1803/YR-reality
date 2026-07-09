import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { verifyAccessToken } from '../utils/generateToken.js';
import { Admin } from '../models/admin.model.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Not authenticated. Please log in.');
  }

  const decoded = verifyAccessToken(token);

  const admin = await Admin.findById(decoded.id).select('-password');
  if (!admin) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Admin belonging to this token no longer exists.');
  }
  if (!admin.isActive) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'This account has been deactivated.');
  }

  req.admin = admin;
  next();
});

// Future-ready role-based authorization
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin?.role)) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action.');
  }
  next();
};
