import { sendEmail } from "../utils/sendEmail.js";
import { env } from "../config/env.js";
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

async forgotPassword(email) {

  console.log("Forgot password email received:", email);

  const admin = await adminRepository.findOne({ email });

  console.log("Admin found:", admin);

  // Don't reveal whether the email exists
  if (!admin) {
    console.log("No admin found with this email");
    return null;
  }

  const crypto = await import("crypto");

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store hashed token
  admin.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token expires in 10 minutes
  admin.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await admin.save({ validateBeforeSave: false });

  // Frontend reset URL
  const resetURL = `${env.ADMIN_URL}/reset-password/${resetToken}`;

  // Beautiful HTML email
  const html = `
  <div style="max-width:600px;margin:auto;padding:30px;font-family:Arial,sans-serif">

      <h2 style="color:#0F4C81;">
        YR Reality
      </h2>

      <p>Hello <strong>${admin.name}</strong>,</p>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the button below to create a new password.
      </p>

      <p style="text-align:center;margin:35px 0;">
        <a href="${resetURL}"
           style="
           background:#0F4C81;
           color:#fff;
           text-decoration:none;
           padding:14px 30px;
           border-radius:6px;
           font-size:16px;">
           Reset Password
        </a>
      </p>

      <p>
        This link will expire in
        <strong>10 minutes</strong>.
      </p>

      <p>
        If you didn't request this password reset,
        you can safely ignore this email.
      </p>

      <hr>

      <small>
      © ${new Date().getFullYear()} YR Reality.
      All Rights Reserved.
      </small>

  </div>
  `;

  await sendEmail({
    to: admin.email,
    subject: "Reset Your YR Reality Password",
    html,
  });

  return true;
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
