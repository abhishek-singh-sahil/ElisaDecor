import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    productCode: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    heroImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    mobileHeroImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    gallery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
    features: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        icon: { type: String, trim: true },
      },
    ],
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    applications: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        image: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    faqs: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true },
      },
    ],
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      canonical: { type: String, trim: true },
      ogTitle: { type: String, trim: true },
      ogDescription: { type: String, trim: true },
      ogImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
      noIndex: { type: Boolean, default: false },
      noFollow: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
