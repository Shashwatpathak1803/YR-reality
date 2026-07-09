import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    photo: { url: String, publicId: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, required: true },
    location: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
