import { Router } from 'express';
import * as faqController from '../controllers/faq.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createFaqValidator, idParamValidator } from '../validators/faq.validator.js';

const router = Router();

router.get('/', faqController.getFaqs);
router.get('/:id', idParamValidator, validate, faqController.getFaqById);

router.post('/', protect, createFaqValidator, validate, faqController.createFaq);
router.put('/:id', protect, idParamValidator, validate, faqController.updateFaq);
router.delete('/:id', protect, idParamValidator, validate, faqController.deleteFaq);

export default router;
