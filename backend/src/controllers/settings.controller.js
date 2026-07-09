import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { settingsService } from '../services/settings.service.js';
import { mediaService } from '../services/media.service.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.get();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, settings, 'Settings fetched successfully'));
});

export const updateSettings = asyncHandler(async (req, res) => {
  if (req.file) req.body.logo = await mediaService.uploadSingle(req.file, { folder: 'real-estate/settings' });
  const settings = await settingsService.update(req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, settings, 'Settings updated successfully'));
});
