import { BaseService } from './base.service.js';
import { blogRepository } from '../repositories/blog.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { generateSlug, generateUniqueSlug } from '../utils/slugify.js';

class BlogService extends BaseService {
  constructor() {
    super(blogRepository, 'Blog');
  }

  async create(payload, authorId) {
    let slug = generateSlug(payload.title);
    const existing = await blogRepository.findBySlug(slug);
    if (existing) slug = generateUniqueSlug(payload.title);
    return blogRepository.create({ ...payload, slug, author: authorId });
  }

  async update(id, payload) {
    if (payload.title) payload.slug = generateSlug(payload.title);
    return super.update(id, payload);
  }

  async getBySlug(slug) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Blog not found');
    blog.views += 1;
    await blog.save();
    return blog;
  }
}

export const blogService = new BlogService();
