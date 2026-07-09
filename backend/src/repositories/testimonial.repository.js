import { BaseRepository } from './base.repository.js';
import { Testimonial } from '../models/testimonial.model.js';

class TestimonialRepository extends BaseRepository {
  constructor() {
    super(Testimonial);
  }
}

export const testimonialRepository = new TestimonialRepository();
