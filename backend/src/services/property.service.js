import { propertyRepository } from '../repositories/property.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { generateSlug, generateUniqueSlug } from '../utils/slugify.js';

const SEARCH_FIELDS = ['title', 'location', 'address'];
const POPULATE = 'category';

class PropertyService {
  async create(payload, adminId) {
    if (payload.category) {
      const category = await categoryRepository.findById(payload.category);
      if (!category) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid category');
    }

    let slug = generateSlug(payload.title);
    const existing = await propertyRepository.findBySlug(slug);
    if (existing) slug = generateUniqueSlug(payload.title);

    return propertyRepository.create({ ...payload, slug, createdBy: adminId });
  }

  async getAll(queryString) {
    return propertyRepository.findWithFeatures(queryString, {
      searchFields: SEARCH_FIELDS,
      populate: POPULATE,
    });
  }

  async getById(id) {
    const property = await propertyRepository.findById(id, POPULATE);
    if (!property) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    return property;
  }

  async getBySlug(slug) {
    const property = await propertyRepository.findBySlug(slug);
    if (!property) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    return property;
  }

  async getByCategory(categorySlug, queryString) {
    return propertyRepository.findByCategorySlug(categorySlug, queryString);
  }

  async getFeatured(limit) {
    return propertyRepository.findFeatured(limit);
  }

  async update(id, payload) {
    if (payload.title) {
      payload.slug = generateSlug(payload.title);
    }
    const property = await propertyRepository.updateById(id, payload);
    if (!property) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    return property;
  }

  async delete(id) {
    const property = await propertyRepository.deleteById(id);
    if (!property) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    return property;
  }
}

export const propertyService = new PropertyService();
