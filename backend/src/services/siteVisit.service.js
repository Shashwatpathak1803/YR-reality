import { BaseService } from './base.service.js';
import { siteVisitRepository } from '../repositories/siteVisit.repository.js';
import { customerService } from './customer.service.js';

class SiteVisitService extends BaseService {
  constructor() {
    super(siteVisitRepository, 'Site Visit');
  }

  async create(payload) {
    const customer = await customerService.findOrCreate({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
    });

    const visit = await siteVisitRepository.create({ ...payload, customer: customer._id });

    await customerService.linkVisit(customer._id, visit._id);
    await customerService.linkProperty(customer._id, payload.property);

    return visit;
  }

  async getAll(queryString) {
    return siteVisitRepository.findWithFeatures(queryString, {
      searchFields: ['name', 'phone', 'email', 'location'],
      populate: 'property customer',
    });
  }
}

export const siteVisitService = new SiteVisitService();
