import { BaseRepository } from './base.repository.js';
import { Blog } from '../models/blog.model.js';

class BlogRepository extends BaseRepository {
  constructor() {
    super(Blog);
  }

  async findBySlug(slug) {
    return this.model.findOne({ slug }).populate('author', 'name');
  }
}

export const blogRepository = new BlogRepository();
