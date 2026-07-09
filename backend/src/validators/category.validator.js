import { body, param } from 'express-validator';

export const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
];

export const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
