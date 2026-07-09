import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Generic service wrapping a repository for simple CRUD modules
// (Category, Offer, Testimonial, Faq). Modules with extra business logic
// (Property, Blog, Enquiry, SiteVisit, Customer, Settings, Auth, Media)
// have their own dedicated service files.
export class BaseService {
  constructor(repository, entityName = 'Resource') {
    this.repository = repository;
    this.entityName = entityName;
  }

  async create(data) {
    return this.repository.create(data);
  }

  async getById(id, populate = '') {
    const doc = await this.repository.findById(id, populate);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found`);
    }
    return doc;
  }

  async getAll(queryString, options = {}) {
    return this.repository.findWithFeatures(queryString, options);
  }

  async update(id, data) {
    const doc = await this.repository.updateById(id, data);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found`);
    }
    return doc;
  }

  async delete(id) {
    const doc = await this.repository.deleteById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found`);
    }
    return doc;
  }
}
