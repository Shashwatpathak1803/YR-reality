import { body } from 'express-validator';

export const updateSettingsValidator = [
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('phoneNumbers').optional().isArray(),
];
