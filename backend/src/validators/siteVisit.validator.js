import { body, param } from 'express-validator';

export const createSiteVisitValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('preferredDate').isISO8601().withMessage('Valid preferred date is required'),
  body('preferredTime').trim().notEmpty().withMessage('Preferred time is required'),
  body('property').optional().isMongoId(),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
