import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { offerService } from '../services/offer.service.js';
import { mediaService } from '../services/media.service.js';
import { makeCrudController } from './factory.controller.js';

const base = makeCrudController(offerService, 'Offer', ['title', 'description']);

export const createOffer = asyncHandler(async (req, res) => {
  if (req.file) req.body.banner = await mediaService.uploadSingle(req.file, { folder: 'real-estate/offers' });
  const doc = await offerService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, doc, 'Offer created successfully'));
});

export const updateOffer = asyncHandler(async (req, res) => {
  if (req.file) req.body.banner = await mediaService.uploadSingle(req.file, { folder: 'real-estate/offers' });
  const doc = await offerService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, doc, 'Offer updated successfully'));
});

export const getOffers = base.getAll;
export const getOfferById = base.getById;
export const deleteOffer = base.remove;
