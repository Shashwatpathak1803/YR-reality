import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { siteVisitService } from '../services/siteVisit.service.js';

export const createSiteVisit = asyncHandler(async (req, res) => {
  const visit = await siteVisitService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, visit, 'Site visit scheduled successfully'));
});

export const getSiteVisits = asyncHandler(async (req, res) => {
  const { data, pagination } = await siteVisitService.getAll(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Site visits fetched successfully', pagination));
});

export const getSiteVisitById = asyncHandler(async (req, res) => {
  const visit = await siteVisitService.getById(req.params.id, 'property customer');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, visit, 'Site visit fetched successfully'));
});

export const updateSiteVisit = asyncHandler(async (req, res) => {
  const visit = await siteVisitService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, visit, 'Site visit updated successfully'));
});

export const deleteSiteVisit = asyncHandler(async (req, res) => {
  await siteVisitService.delete(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Site visit deleted successfully'));
});
