import { BaseService } from './base.service.js';
import { testimonialRepository } from '../repositories/testimonial.repository.js';

class TestimonialService extends BaseService {
  constructor() {
    super(testimonialRepository, 'Testimonial');
  }
}

export const testimonialService = new TestimonialService();
