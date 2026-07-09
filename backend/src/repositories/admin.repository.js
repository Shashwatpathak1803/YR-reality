import { BaseRepository } from './base.repository.js';
import { Admin } from '../models/admin.model.js';

class AdminRepository extends BaseRepository {
  constructor() {
    super(Admin);
  }

  async findByEmailWithPassword(email) {
    return this.model.findOne({ email }).select('+password');
  }
}

export const adminRepository = new AdminRepository();
