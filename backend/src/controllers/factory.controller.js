import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Generates standard CRUD handlers bound to a given service.
// Used for simple modules (Category, Offer, Testimonial, FAQ) to avoid
// duplicating identical controller code.
export const makeCrudController = (service, entityName, searchFields = []) => ({
  create: asyncHandler(async (req, res) => {
    const doc = await service.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, doc, `${entityName} created successfully`));
  }),

  getAll: asyncHandler(async (req, res) => {
    const { data, pagination } = await service.getAll(req.query, { searchFields });
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, `${entityName}s fetched successfully`, pagination));
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await service.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, doc, `${entityName} fetched successfully`));
  }),

  update: asyncHandler(async (req, res) => {
    const doc = await service.update(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, doc, `${entityName} updated successfully`));
  }),

  remove: asyncHandler(async (req, res) => {
    await service.delete(req.params.id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, `${entityName} deleted successfully`));
  }),
});
