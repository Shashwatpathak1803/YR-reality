import { body, param } from 'express-validator';

export const createFaqValidator = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
