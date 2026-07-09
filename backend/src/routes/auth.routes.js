import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.validator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */

router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/change-password', protect, changePasswordValidator, validate, authController.changePassword);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

export default router;
