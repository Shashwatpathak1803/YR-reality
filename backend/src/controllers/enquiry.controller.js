import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { enquiryService } from '../services/enquiry.service.js';

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, enquiry, 'Enquiry submitted successfully'));
});

export const getEnquiries = asyncHandler(async (req, res) => {
  const { data, pagination } = await enquiryService.getAll(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Enquiries fetched successfully', pagination));
});

export const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.getById(req.params.id, 'propertyInterested customer');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, enquiry, 'Enquiry fetched successfully'));
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, enquiry, 'Enquiry updated successfully'));
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  await enquiryService.delete(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Enquiry deleted successfully'));
});
