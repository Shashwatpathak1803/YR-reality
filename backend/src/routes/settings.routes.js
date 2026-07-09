import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { updateSettingsValidator } from '../validators/settings.validator.js';

const router = Router();

router.get('/', settingsController.getSettings); // public: website needs company info
router.put('/', protect, upload.single('logo'), updateSettingsValidator, validate, settingsController.updateSettings);

export default router;
