import { body, param } from 'express-validator';

export const createOfferValidator = [
  body('title').trim().notEmpty().withMessage('Offer title is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('discount').optional().isFloat({ min: 0, max: 100 }),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
