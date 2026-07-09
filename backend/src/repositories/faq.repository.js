import { BaseRepository } from './base.repository.js';
import { Faq } from '../models/faq.model.js';

class FaqRepository extends BaseRepository {
  constructor() {
    super(Faq);
  }
}

export const faqRepository = new FaqRepository();
