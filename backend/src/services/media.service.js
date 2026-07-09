import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { mediaRepository } from '../repositories/media.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const resourceTypeFor = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw';
};

// Local storage fallback (used when Cloudinary is not configured).
// Files land in backend/uploads and are served statically at /uploads.
export const UPLOADS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
const LOCAL_PUBLIC_ID_PREFIX = 'local/';

const extensionFor = (mimetype, originalname) => {
  const fromName = path.extname(originalname || '').toLowerCase();
  if (fromName) return fromName;
  const map = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'video/mp4': '.mp4', 'video/quicktime': '.mov', 'application/pdf': '.pdf' };
  return map[mimetype] || '';
};

class MediaService {
  async uploadBuffer(fileBuffer, { folder = 'real-estate', mimetype, originalname } = {}) {
    const resourceType = resourceTypeFor(mimetype || 'image');

    if (!isCloudinaryConfigured) {
      return this.uploadToDisk(fileBuffer, { mimetype, originalname, resourceType });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType },
        (error, uploaded) => {
          if (error) return reject(error);
          resolve(uploaded);
        }
      );
      uploadStream.end(fileBuffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      size: result.bytes,
      originalName: originalname,
    };
  }

  async uploadToDisk(fileBuffer, { mimetype, originalname, resourceType }) {
    const ext = extensionFor(mimetype, originalname);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, filename), fileBuffer);
    return {
      url: `${env.SERVER_URL}/uploads/${filename}`,
      publicId: `${LOCAL_PUBLIC_ID_PREFIX}${filename}`,
      resourceType,
      format: ext.replace('.', ''),
      size: fileBuffer.length,
      originalName: originalname,
    };
  }

  async uploadSingle(file, options = {}) {
    if (!file) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No file provided');
    const uploaded = await this.uploadBuffer(file.buffer, {
      ...options,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
    return uploaded;
  }

  async uploadMultiple(files, options = {}) {
    if (!files || files.length === 0) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No files provided');
    return Promise.all(files.map((file) => this.uploadSingle(file, options)));
  }

  async uploadAndSave(file, { folder, uploadedBy } = {}) {
    const uploaded = await this.uploadSingle(file, { folder });
    return mediaRepository.create({ ...uploaded, folder, uploadedBy });
  }

  async deleteMedia(publicId, resourceType = 'image') {
    if (publicId.startsWith(LOCAL_PUBLIC_ID_PREFIX)) {
      const filename = path.basename(publicId.slice(LOCAL_PUBLIC_ID_PREFIX.length));
      await fs.unlink(path.join(UPLOADS_DIR, filename)).catch(() => {});
    } else {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    }
    await mediaRepository.deleteByPublicId(publicId);
    return true;
  }

  async listAll(queryString) {
    return mediaRepository.findWithFeatures(queryString, {});
  }
}

export const mediaService = new MediaService();
