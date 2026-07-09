import mongoose from 'mongoose';
import { VISIT_STATUS } from '../constants/roles.js';

const siteVisitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    location: String,
    notes: String,
    status: { type: String, enum: Object.values(VISIT_STATUS), default: VISIT_STATUS.PENDING },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  },
  { timestamps: true }
);

export const SiteVisit = mongoose.model('SiteVisit', siteVisitSchema);
