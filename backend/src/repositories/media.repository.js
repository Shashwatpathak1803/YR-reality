import { BaseRepository } from './base.repository.js';
import { Media } from '../models/media.model.js';

class MediaRepository extends BaseRepository {
  constructor() {
    super(Media);
  }

  async deleteByPublicId(publicId) {
    return this.model.findOneAndDelete({ publicId });
  }
}

export const mediaRepository = new MediaRepository();
