import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    thumbnail: { url: String, publicId: String },
    description: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    category: { type: String, trim: true },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    seoTitle: String,
    seoDescription: String,
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', content: 'text' });

export const Blog = mongoose.model('Blog', blogSchema);
