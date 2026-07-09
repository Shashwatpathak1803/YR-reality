import { BaseRepository } from './base.repository.js';
import { Category } from '../models/category.model.js';

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findBySlug(slug) {
    return this.model.findOne({ slug });
  }
}

export const categoryRepository = new CategoryRepository();
