import mongoose from 'mongoose';
import { LEAD_STATUS } from '../constants/roles.js';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    interestedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    visitHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SiteVisit' }],
    enquiries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' }],
    leadStatus: { type: String, enum: Object.values(LEAD_STATUS), default: LEAD_STATUS.NEW },
    notes: String,
  },
  { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);
