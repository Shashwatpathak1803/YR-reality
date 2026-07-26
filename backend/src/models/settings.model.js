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

settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      companyName: 'YR Realty',
      phoneNumbers: ['+91 99714 05532'],
      email: 'yrrealty9123@gmail.com',
      whatsapp: '919971405532',
    });
  } else {
    settings.whatsapp = '919971405532';
    settings.phoneNumbers = ['+91 99714 05532'];
    await settings.save();
  }
  return settings;
};

export const Settings = mongoose.model('Settings', settingsSchema);
