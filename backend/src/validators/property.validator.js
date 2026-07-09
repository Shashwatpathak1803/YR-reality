import { body, param } from 'express-validator';

export const createPropertyValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('bedrooms').optional().isInt({ min: 0 }),
  body('bathrooms').optional().isInt({ min: 0 }),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
];

export const updatePropertyValidator = [
  param('id').isMongoId().withMessage('Invalid property ID'),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isMongoId(),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid ID')];
