import { BaseService } from './base.service.js';
import { customerRepository } from '../repositories/customer.repository.js';

class CustomerService extends BaseService {
  constructor() {
    super(customerRepository, 'Customer');
  }

  // Finds an existing customer by phone or creates a new one.
  // Called internally whenever an Enquiry or SiteVisit is submitted.
  async findOrCreate({ name, phone, email }) {
    let customer = await customerRepository.findByPhone(phone);
    if (!customer) {
      customer = await customerRepository.create({ name, phone, email });
    }
    return customer;
  }

  async linkProperty(customerId, propertyId) {
    if (!propertyId) return;
    await customerRepository.model.findByIdAndUpdate(customerId, {
      $addToSet: { interestedProperties: propertyId },
    });
  }

  async linkEnquiry(customerId, enquiryId) {
    await customerRepository.model.findByIdAndUpdate(customerId, {
      $addToSet: { enquiries: enquiryId },
    });
  }

  async linkVisit(customerId, visitId) {
    await customerRepository.model.findByIdAndUpdate(customerId, {
      $addToSet: { visitHistory: visitId },
    });
  }

  async getAll(queryString) {
    return customerRepository.findWithFeatures(queryString, {
      searchFields: ['name', 'phone', 'email'],
      populate: 'interestedProperties visitHistory enquiries',
    });
  }
}

export const customerService = new CustomerService();
