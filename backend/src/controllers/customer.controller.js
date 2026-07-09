import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { customerService } from '../services/customer.service.js';

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, customer, 'Customer created successfully'));
});

export const getCustomers = asyncHandler(async (req, res) => {
  const { data, pagination } = await customerService.getAll(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Customers fetched successfully', pagination));
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await customerService.getById(req.params.id, 'interestedProperties visitHistory enquiries');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, customer, 'Customer fetched successfully'));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, customer, 'Customer updated successfully'));
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.delete(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Customer deleted successfully'));
});
