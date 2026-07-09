import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { propertyService } from '../services/property.service.js';
import { mediaService } from '../services/media.service.js';

export const createProperty = asyncHandler(async (req, res) => {
  const files = req.files || {};

  if (files.images?.length) {
    req.body.images = await mediaService.uploadMultiple(files.images, { folder: 'real-estate/properties' });
  }
  if (files.videos?.length) {
    req.body.videos = await mediaService.uploadMultiple(files.videos, { folder: 'real-estate/properties' });
  }
  if (files.brochure?.[0]) {
    req.body.brochure = await mediaService.uploadSingle(files.brochure[0], { folder: 'real-estate/brochures' });
  }
  if (files.floorPlan?.[0]) {
    req.body.floorPlan = await mediaService.uploadSingle(files.floorPlan[0], { folder: 'real-estate/floorplans' });
  }
  if (typeof req.body.amenities === 'string') {
    req.body.amenities = req.body.amenities.split(',').map((a) => a.trim());
  }
  if (typeof req.body.keywords === 'string') {
    req.body.keywords = req.body.keywords.split(',').map((k) => k.trim());
  }

  const property = await propertyService.create(req.body, req.admin._id);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, property, 'Property created successfully'));
});

export const getProperties = asyncHandler(async (req, res) => {
  const { data, pagination } = await propertyService.getAll(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Properties fetched successfully', pagination));
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await propertyService.getById(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, property, 'Property fetched successfully'));
});

export const getPropertyBySlug = asyncHandler(async (req, res) => {
  const property = await propertyService.getBySlug(req.params.slug);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, property, 'Property fetched successfully'));
});

export const getPropertiesByCategory = asyncHandler(async (req, res) => {
  const { data, pagination } = await propertyService.getByCategory(req.params.category, req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Properties fetched successfully', pagination));
});

export const getFeaturedProperties = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 8;
  const properties = await propertyService.getFeatured(limit);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, properties, 'Featured properties fetched successfully'));
});

export const updateProperty = asyncHandler(async (req, res) => {
  const files = req.files || {};

  if (files.images?.length) {
    req.body.images = await mediaService.uploadMultiple(files.images, { folder: 'real-estate/properties' });
  }
  if (files.videos?.length) {
    req.body.videos = await mediaService.uploadMultiple(files.videos, { folder: 'real-estate/properties' });
  }
  if (files.brochure?.[0]) {
    req.body.brochure = await mediaService.uploadSingle(files.brochure[0], { folder: 'real-estate/brochures' });
  }
  if (files.floorPlan?.[0]) {
    req.body.floorPlan = await mediaService.uploadSingle(files.floorPlan[0], { folder: 'real-estate/floorplans' });
  }
  if (typeof req.body.amenities === 'string') {
    req.body.amenities = req.body.amenities.split(',').map((a) => a.trim());
  }

  const property = await propertyService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, property, 'Property updated successfully'));
});

export const deleteProperty = asyncHandler(async (req, res) => {
  await propertyService.delete(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Property deleted successfully'));
});
