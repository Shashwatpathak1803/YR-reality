import { Router } from 'express';
import * as enquiryController from '../controllers/enquiry.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createEnquiryValidator, idParamValidator } from '../validators/enquiry.validator.js';

const router = Router();

// Public: submitted by website visitors
router.post('/', createEnquiryValidator, validate, enquiryController.createEnquiry);

// Protected: managed by admin
router.get('/', protect, enquiryController.getEnquiries);
router.get('/:id', protect, idParamValidator, validate, enquiryController.getEnquiryById);
router.put('/:id', protect, idParamValidator, validate, enquiryController.updateEnquiry);
router.delete('/:id', protect, idParamValidator, validate, enquiryController.deleteEnquiry);

export default router;
