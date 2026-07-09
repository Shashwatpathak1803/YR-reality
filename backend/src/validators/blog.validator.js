import { body, param } from 'express-validator';

export const createBlogValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
