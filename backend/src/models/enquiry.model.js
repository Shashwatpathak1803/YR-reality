import mongoose from 'mongoose';
import { ENQUIRY_STATUS } from '../constants/roles.js';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    budget: String,
    preferredLocation: String,
    propertyInterested: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    message: { type: String, trim: true },
    sourcePage: { type: String, trim: true },
    status: { type: String, enum: Object.values(ENQUIRY_STATUS), default: ENQUIRY_STATUS.NEW },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
