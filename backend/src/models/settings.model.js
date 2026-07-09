import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: '' },
    logo: { url: String, publicId: String },
    address: { type: String, default: '' },
    phoneNumbers: [{ type: String }],
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
    },
    googleMap: { type: String, default: '' },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
    },
  },
  { timestamps: true }
);

// Singleton pattern: only ever one settings document
settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export const Settings = mongoose.model('Settings', settingsSchema);
