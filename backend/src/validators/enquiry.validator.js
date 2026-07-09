import { body, param } from 'express-validator';

export const createEnquiryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('propertyInterested').optional().isMongoId(),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
