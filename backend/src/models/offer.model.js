import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    banner: { url: String, publicId: String },
    description: { type: String, trim: true },
    discount: { type: Number, min: 0, max: 100 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Offer = mongoose.model('Offer', offerSchema);
