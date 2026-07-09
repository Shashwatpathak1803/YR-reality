import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { mediaService } from '../services/media.service.js';

export const uploadSingleMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No file uploaded');
  const media = await mediaService.uploadAndSave(req.file, {
    folder: req.body.folder || 'real-estate/misc',
    uploadedBy: req.admin._id,
  });
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, media, 'File uploaded successfully'));
});

export const uploadMultipleMedia = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No files uploaded');
  const uploaded = await Promise.all(
    req.files.map((file) =>
      mediaService.uploadAndSave(file, { folder: req.body.folder || 'real-estate/misc', uploadedBy: req.admin._id })
    )
  );
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, uploaded, 'Files uploaded successfully'));
});

export const listMedia = asyncHandler(async (req, res) => {
  const { data, pagination } = await mediaService.listAll(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Media fetched successfully', pagination));
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  const resourceType = req.query.resourceType || 'image';
  await mediaService.deleteMedia(decodeURIComponent(publicId), resourceType);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, 'Media deleted successfully'));
});
