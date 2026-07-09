import { Router } from 'express';
import * as offerController from '../controllers/offer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createOfferValidator, idParamValidator } from '../validators/offer.validator.js';

const router = Router();

router.get('/', offerController.getOffers);
router.get('/:id', idParamValidator, validate, offerController.getOfferById);

router.post('/', protect, upload.single('banner'), createOfferValidator, validate, offerController.createOffer);
router.put('/:id', protect, upload.single('banner'), idParamValidator, validate, offerController.updateOffer);
router.delete('/:id', protect, idParamValidator, validate, offerController.deleteOffer);

export default router;
