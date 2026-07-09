import { BaseRepository } from './base.repository.js';
import { Enquiry } from '../models/enquiry.model.js';

class EnquiryRepository extends BaseRepository {
  constructor() {
    super(Enquiry);
  }
}

export const enquiryRepository = new EnquiryRepository();
