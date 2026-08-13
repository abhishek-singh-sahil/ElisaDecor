import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productNameSnapshot: {
      type: String,
      trim: true,
    },
    productSlug: {
      type: String,
      trim: true,
    },
    requirement: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    sourcePage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'QUALIFIED', 'CLOSED', 'SPAM'],
      default: 'NEW',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
    },
    notes: [
      {
        note: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    consent: {
      type: Boolean,
      default: false,
    },
    ipHash: {
      type: String,
      index: true,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
