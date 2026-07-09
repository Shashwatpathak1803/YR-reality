import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { testimonialService } from '../services/testimonial.service.js';
import { mediaService } from '../services/media.service.js';
import { makeCrudController } from './factory.controller.js';

const base = makeCrudController(testimonialService, 'Testimonial', ['customerName', 'review']);

export const createTestimonial = asyncHandler(async (req, res) => {
  if (req.file) req.body.photo = await mediaService.uploadSingle(req.file, { folder: 'real-estate/testimonials' });
  const doc = await testimonialService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, doc, 'Testimonial created successfully'));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  if (req.file) req.body.photo = await mediaService.uploadSingle(req.file, { folder: 'real-estate/testimonials' });
  const doc = await testimonialService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, doc, 'Testimonial updated successfully'));
});

export const getTestimonials = base.getAll;
export const getTestimonialById = base.getById;
export const deleteTestimonial = base.remove;
