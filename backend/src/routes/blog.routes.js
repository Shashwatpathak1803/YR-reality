import { Router } from 'express';
import * as blogController from '../controllers/blog.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createBlogValidator, idParamValidator } from '../validators/blog.validator.js';

const router = Router();

router.get('/', blogController.getBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', idParamValidator, validate, blogController.getBlogById);

router.post('/', protect, upload.single('thumbnail'), createBlogValidator, validate, blogController.createBlog);
router.put('/:id', protect, upload.single('thumbnail'), idParamValidator, validate, blogController.updateBlog);
router.delete('/:id', protect, idParamValidator, validate, blogController.deleteBlog);

export default router;
