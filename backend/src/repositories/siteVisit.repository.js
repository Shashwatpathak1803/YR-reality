import { BaseRepository } from './base.repository.js';
import { SiteVisit } from '../models/siteVisit.model.js';

class SiteVisitRepository extends BaseRepository {
  constructor() {
    super(SiteVisit);
  }
}

export const siteVisitRepository = new SiteVisitRepository();
