import mongoose from 'mongoose';

const mediaLibrarySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    folder: { type: String, default: 'real-estate' },
    originalName: String,
    size: Number,
    format: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

export const Media = mongoose.model('Media', mediaLibrarySchema);
