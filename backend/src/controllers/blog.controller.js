import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { blogService } from '../services/blog.service.js';
import { mediaService } from '../services/media.service.js';

export const createBlog = asyncHandler(async (req, res) => {
  if (req.file) req.body.thumbnail = await mediaService.uploadSingle(req.file, { folder: 'real-estate/blogs' });
  if (typeof req.body.tags === 'string') req.body.tags = req.body.tags.split(',').map((t) => t.trim());
  const blog = await blogService.create(req.body, req.admin._id);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, blog, 'Blog created successfully'));
});

export const getBlogs = asyncHandler(async (req, res) => {
  const { data, pagination } = await blogService.getAll(req.query, { searchFields: ['title', 'content'], populate: 'author' });
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Blogs fetched successfully', pagination));
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await blogService.getById(req.params.id, 'author');
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, blog, 'Blog fetched successfully'));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await blogService.getBySlug(req.params.slug);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, blog, 'Blog fetched successfully'));
});

export const updateBlog = asyncHandler(async (req, res) => {
  if (req.file) req.body.thumbnail = await mediaService.uploadSingle(req.file, { folder: 'real-estate/blogs' });
  if (typeof req.body.tags === 'string') req.body.tags = req.body.tags.split(',').map((t) => t.trim());
  const blog = await blogService.update(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, blog, 'Blog updated successfully'));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  await blogService.delete(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Blog deleted successfully'));
});
