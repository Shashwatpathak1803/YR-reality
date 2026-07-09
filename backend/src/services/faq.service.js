import { BaseService } from './base.service.js';
import { faqRepository } from '../repositories/faq.repository.js';

class FaqService extends BaseService {
  constructor() {
    super(faqRepository, 'FAQ');
  }
}

export const faqService = new FaqService();
