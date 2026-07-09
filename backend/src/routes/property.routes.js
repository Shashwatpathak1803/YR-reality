import { Router } from 'express';
import * as propertyController from '../controllers/property.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  createPropertyValidator,
  updatePropertyValidator,
  idParamValidator,
} from '../validators/property.validator.js';

const router = Router();

const propertyUploadFields = upload.fields([
  { name: 'images', maxCount: 20 },
  { name: 'videos', maxCount: 5 },
  { name: 'brochure', maxCount: 1 },
  { name: 'floorPlan', maxCount: 1 },
]);

// Public
router.get('/', propertyController.getProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/category/:category', propertyController.getPropertiesByCategory);
router.get('/slug/:slug', propertyController.getPropertyBySlug);
router.get('/:id', idParamValidator, validate, propertyController.getPropertyById);

// Protected (Admin)
router.post('/', protect, propertyUploadFields, createPropertyValidator, validate, propertyController.createProperty);
router.put('/:id', protect, propertyUploadFields, updatePropertyValidator, validate, propertyController.updateProperty);
router.delete('/:id', protect, idParamValidator, validate, propertyController.deleteProperty);

export default router;
