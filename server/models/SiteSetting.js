import mongoose from 'mongoose';

const SiteSettingSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'Elisa Decor',
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    favicon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    whatsApp: {
      type: String,
      trim: true,
    },
    socialUrls: {
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    businessHours: {
      type: String,
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      trim: true,
    },
    defaultSeo: {
      title: { type: String, trim: true, default: 'Elisa Decor | Premium Plywood & Interior Materials' },
      description: { type: String, trim: true, default: 'Discover Elisa Decor - premium plywood and high-end decor materials designed for luxury interiors, residential, and commercial spaces.' },
      ogTitle: { type: String, trim: true },
      ogDescription: { type: String, trim: true },
      ogImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
    },
    emailSettings: {
      businessEnquiryEmail: { type: String, trim: true, default: 'enquiry@elisadecor.com' },
      customerConfirmationOn: { type: Boolean, default: false },
      emailSubject: { type: String, trim: true, default: 'New Enquiry Received - Elisa Decor Website' },
      senderName: { type: String, trim: true, default: 'Elisa Decor Website' },
      replyTo: { type: String, trim: true },
    },
    navigation: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
        visible: { type: Boolean, default: true },
        isProductList: { type: Boolean, default: false },
      },
    ],
    footer: {
      description: { type: String, trim: true },
      copyrightText: { type: String, trim: true },
      links: [
        {
          label: { type: String, trim: true },
          url: { type: String, trim: true },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
