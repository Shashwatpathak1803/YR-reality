import { BaseService } from './base.service.js';
import { enquiryRepository } from '../repositories/enquiry.repository.js';
import { customerService } from './customer.service.js';

class EnquiryService extends BaseService {
  constructor() {
    super(enquiryRepository, 'Enquiry');
  }

  // Every enquiry automatically creates (or reuses) a customer record and is
  // treated as a lead in the admin experience.
  async create(payload) {
    const customer = await customerService.findOrCreate({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
    });

    const enquiry = await enquiryRepository.create({ ...payload, customer: customer._id });

    await customerService.linkEnquiry(customer._id, enquiry._id);
    await customerService.linkProperty(customer._id, payload.propertyInterested);

    return enquiry;
  }

  async getAll(queryString) {
    return enquiryRepository.findWithFeatures(queryString, {
      searchFields: ['name', 'phone', 'email'],
      populate: 'propertyInterested customer',
    });
  }
}

export const enquiryService = new EnquiryService();
