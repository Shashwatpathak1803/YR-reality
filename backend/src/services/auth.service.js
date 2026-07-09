import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { adminRepository } from '../repositories/admin.repository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';

class AuthService {
  async login(email, password) {
    const admin = await adminRepository.findByEmailWithPassword(email);
    if (!admin || !(await admin.comparePassword(password))) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }
    if (!admin.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'This account has been deactivated');
    }

    admin.lastLogin = new Date();
    const accessToken = generateAccessToken({ id: admin._id, role: admin.role });
    const refreshToken = generateRefreshToken({ id: admin._id });
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    const safeAdmin = admin.toObject();
    delete safeAdmin.password;
    delete safeAdmin.refreshToken;

    return { admin: safeAdmin, accessToken, refreshToken };
  }

  async logout(adminId) {
    await adminRepository.updateById(adminId, { refreshToken: null });
  }

  async getMe(adminId) {
    const admin = await adminRepository.findById(adminId);
    if (!admin) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Admin not found');
    return admin;
  }

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await adminRepository.model.findById(adminId).select('+password');
    if (!admin) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Admin not found');

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');

    admin.password = newPassword;
    await admin.save();
    return true;
  }

  // Future-ready: forgot password flow (email service to be integrated)
  async forgotPassword(email) {
    const admin = await adminRepository.findOne({ email });
    if (!admin) {
      // Do not reveal whether the email exists
      return null;
    }
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save({ validateBeforeSave: false });
    return resetToken; // TODO: send via email service once integrated
  }

  async resetPassword(rawToken, newPassword) {
    const crypto = await import('crypto');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const admin = await adminRepository.model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!admin) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Token is invalid or has expired');

    admin.password = newPassword;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();
    return true;
  }

  // Future-ready: refresh token rotation
  async refreshAccessToken(token) {
    if (!token) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token missing');
    const decoded = verifyRefreshToken(token);
    const admin = await adminRepository.model.findById(decoded.id).select('+refreshToken');
    if (!admin || admin.refreshToken !== token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid refresh token');
    }
    const accessToken = generateAccessToken({ id: admin._id, role: admin.role });
    return accessToken;
  }
}

export const authService = new AuthService();
