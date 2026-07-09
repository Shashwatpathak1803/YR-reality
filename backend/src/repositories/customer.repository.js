import { BaseRepository } from './base.repository.js';
import { Customer } from '../models/customer.model.js';

class CustomerRepository extends BaseRepository {
  constructor() {
    super(Customer);
  }

  async findByPhone(phone) {
    return this.model.findOne({ phone });
  }
}

export const customerRepository = new CustomerRepository();
