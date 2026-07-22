import { body } from 'express-validator';

export const updateSettingsValidator = [
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Valid email required'),
  body('phoneNumbers').optional({ values: 'falsy' }).isArray().withMessage('Phone numbers must be an array'),
  body('whatsapp').optional({ values: 'falsy' }).trim().isString().withMessage('WhatsApp number must be a string'),
];
