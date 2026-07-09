import { BaseService } from './base.service.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { generateSlug, generateUniqueSlug } from '../utils/slugify.js';

class CategoryService extends BaseService {
  constructor() {
    super(categoryRepository, 'Category');
  }

  async create(payload) {
    let slug = generateSlug(payload.name);
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) slug = generateUniqueSlug(payload.name);
    return categoryRepository.create({ ...payload, slug });
  }

  async update(id, payload) {
    if (payload.name) payload.slug = generateSlug(payload.name);
    return super.update(id, payload);
  }
}

export const categoryService = new CategoryService();
