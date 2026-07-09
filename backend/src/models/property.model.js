import mongoose from 'mongoose';
import { PROPERTY_STATUS, CONSTRUCTION_STATUS } from '../constants/roles.js';

const mediaSchema = new mongoose.Schema(
  { url: String, publicId: String, resourceType: String },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },

    location: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    latitude: Number,
    longitude: Number,

    featured: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(PROPERTY_STATUS), default: PROPERTY_STATUS.AVAILABLE },
    available: { type: Boolean, default: true },
    sold: { type: Boolean, default: false },
    upcoming: { type: Boolean, default: false },

    plotSize: String,
    area: { type: Number },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    parking: { type: Number, default: 0 },
    constructionStatus: { type: String, enum: Object.values(CONSTRUCTION_STATUS) },

    amenities: [{ type: String }],
    images: [mediaSchema],
    videos: [mediaSchema],
    brochure: mediaSchema,
    floorPlan: mediaSchema,

    seoTitle: String,
    seoDescription: String,
    keywords: [{ type: String }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

propertySchema.index({ title: 'text', location: 'text', description: 'text' });
propertySchema.index({ price: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ featured: 1 });

export const Property = mongoose.model('Property', propertySchema);
