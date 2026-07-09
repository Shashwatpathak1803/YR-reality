import { body, param } from 'express-validator';

export const createTestimonialValidator = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').trim().notEmpty().withMessage('Review is required'),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
