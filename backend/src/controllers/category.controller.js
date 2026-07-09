import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { categoryService } from '../services/category.service.js';
import { mediaService } from '../services/media.service.js';
import { makeCrudController } from './factory.controller.js';

const base = makeCrudController(categoryService, 'Category', ['name', 'description']);

export const createCategory = asyncHandler(async (req, res) => {
  if (req.files?.icon?.[0]) req.body.icon = await mediaService.uploadSingle(req.files.icon[0], { folder: 'real-estate/categories' });
  if (req.files?.image?.[0]) req.body.image = await mediaService.uploadSingle(req.files.image[0], { folder: 'real-estate/categories' });
  const doc = await categoryService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, doc, 'Category created successfully'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  if (req.files?.icon?.[0]) req.body.icon = await mediaService.uploadSingle(req.files.icon[0], { folder: 'real-estate/categories' });
  if (req.files?.image?.[0]) req.body.image = await mediaService.uploadSingle(req.files.image[0], { folder: 'real-estate/categories' });
  const doc = await categoryService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, doc, 'Category updated successfully'));
});

export const getCategories = base.getAll;
export const getCategoryById = base.getById;
export const deleteCategory = base.remove;
