import mongoose from 'mongoose';

const HomepageSchema = new mongoose.Schema(
  {
    sections: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            'Hero',
            'About',
            'Products',
            'WhyChooseUs',
            'Applications',
            'Storytelling',
            'Process',
            'Projects',
            'Testimonials',
            'FAQ',
            'CTA',
          ],
        },
        enabled: {
          type: Boolean,
          default: true,
        },
        order: {
          type: Number,
          default: 0,
        },
        content: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        settings: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Homepage || mongoose.model('Homepage', HomepageSchema);
