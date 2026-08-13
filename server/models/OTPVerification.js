import mongoose from 'mongoose';

const OTPVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['PASSWORD_CHANGE', 'EMAIL_CHANGE_OLD', 'EMAIL_CHANGE_NEW'],
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes validity
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: delete document once expiresAt time is reached
OTPVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTPVerification || mongoose.model('OTPVerification', OTPVerificationSchema);
