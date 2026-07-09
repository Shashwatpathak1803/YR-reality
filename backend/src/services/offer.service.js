import { BaseService } from './base.service.js';
import { offerRepository } from '../repositories/offer.repository.js';

class OfferService extends BaseService {
  constructor() {
    super(offerRepository, 'Offer');
  }
}

export const offerService = new OfferService();
