import { BaseRepository } from './base.repository.js';
import { Offer } from '../models/offer.model.js';

class OfferRepository extends BaseRepository {
  constructor() {
    super(Offer);
  }
}

export const offerRepository = new OfferRepository();
