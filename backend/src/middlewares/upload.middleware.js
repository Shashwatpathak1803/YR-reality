import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Memory storage: buffers are streamed directly to Cloudinary (no local disk writes)
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'application/pdf',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Unsupported file type: ${file.mimetype}. Allowed: images, mp4/mov videos, pdf.`
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export const uploadExtensionCheck = (file) =>
  ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.mov', '.pdf'].includes(
    path.extname(file.originalname).toLowerCase()
  );
