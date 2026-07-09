import { Router } from 'express';
import * as siteVisitController from '../controllers/siteVisit.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createSiteVisitValidator, idParamValidator } from '../validators/siteVisit.validator.js';

const router = Router();

// Public: submitted by website visitors
router.post('/', createSiteVisitValidator, validate, siteVisitController.createSiteVisit);

// Protected: managed by admin
router.get('/', protect, siteVisitController.getSiteVisits);
router.get('/:id', protect, idParamValidator, validate, siteVisitController.getSiteVisitById);
router.put('/:id', protect, idParamValidator, validate, siteVisitController.updateSiteVisit);
router.delete('/:id', protect, idParamValidator, validate, siteVisitController.deleteSiteVisit);

export default router;
