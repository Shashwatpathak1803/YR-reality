import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createCategoryValidator, idParamValidator } from '../validators/category.validator.js';

const router = Router();
const categoryUpload = upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]);

router.get('/', categoryController.getCategories);
router.get('/:id', idParamValidator, validate, categoryController.getCategoryById);

router.post('/', protect, categoryUpload, createCategoryValidator, validate, categoryController.createCategory);
router.put('/:id', protect, categoryUpload, idParamValidator, validate, categoryController.updateCategory);
router.delete('/:id', protect, idParamValidator, validate, categoryController.deleteCategory);

export default router;
