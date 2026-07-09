import { Router } from 'express';
import * as testimonialController from '../controllers/testimonial.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createTestimonialValidator, idParamValidator } from '../validators/testimonial.validator.js';

const router = Router();

router.get('/', testimonialController.getTestimonials);
router.get('/:id', idParamValidator, validate, testimonialController.getTestimonialById);

router.post('/', protect, upload.single('photo'), createTestimonialValidator, validate, testimonialController.createTestimonial);
router.put('/:id', protect, upload.single('photo'), idParamValidator, validate, testimonialController.updateTestimonial);
router.delete('/:id', protect, idParamValidator, validate, testimonialController.deleteTestimonial);

export default router;
