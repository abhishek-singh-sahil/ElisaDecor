import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    size: {
      type: Number,
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    folder: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
