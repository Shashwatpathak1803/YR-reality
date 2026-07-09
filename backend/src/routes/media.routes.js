import { Router } from 'express';
import * as mediaController from '../controllers/media.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Public: the website gallery reads uploaded media
router.get('/', mediaController.listMedia);

// Protected (Admin)
router.post('/upload', protect, upload.single('file'), mediaController.uploadSingleMedia);
router.post('/upload-multiple', protect, upload.array('files', 20), mediaController.uploadMultipleMedia);
router.delete('/:publicId', protect, mediaController.deleteMedia);

export default router;
