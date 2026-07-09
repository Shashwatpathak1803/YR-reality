import { BaseRepository } from './base.repository.js';
import { Property } from '../models/property.model.js';

class PropertyRepository extends BaseRepository {
  constructor() {
    super(Property);
  }

  async findBySlug(slug) {
    return this.model.findOne({ slug }).populate('category', 'name slug');
  }

  async findByCategorySlug(categorySlug, queryString) {
    const Category = (await import('../models/category.model.js')).Category;
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };

    return this.findWithFeatures(
      { ...queryString, category: category._id.toString() },
      { searchFields: ['title', 'location'], populate: 'category' }
    );
  }

  async findFeatured(limit = 8) {
    return this.model.find({ featured: true }).populate('category', 'name slug').limit(limit).sort('-createdAt');
  }
}

export const propertyRepository = new PropertyRepository();
