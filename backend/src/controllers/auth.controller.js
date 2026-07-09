import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { authService } from '../services/auth.service.js';
import { cookieOptions } from '../utils/generateToken.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { admin, accessToken, refreshToken } = await authService.login(email, password);

  res
    .status(HTTP_STATUS.OK)
    .cookie('token', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(HTTP_STATUS.OK, { admin, accessToken }, 'Login successful'));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.admin._id);
  res
    .status(HTTP_STATUS.OK)
    .clearCookie('token', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(HTTP_STATUS.OK, null, 'Logout successful'));
});

export const getMe = asyncHandler(async (req, res) => {
  const admin = await authService.getMe(req.admin._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, admin, 'Current admin fetched'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.admin._id, currentPassword, newPassword);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Password changed successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const resetToken = await authService.forgotPassword(email);
  // In production this token is emailed to the admin, never returned in the response.
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, null, 'If that email exists, a reset link has been sent')
  );
  void resetToken;
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Password reset successful'));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const accessToken = await authService.refreshAccessToken(token);
  res
    .status(HTTP_STATUS.OK)
    .cookie('token', accessToken, cookieOptions)
    .json(new ApiResponse(HTTP_STATUS.OK, { accessToken }, 'Token refreshed'));
});
