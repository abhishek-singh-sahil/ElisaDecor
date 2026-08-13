import mongoose from 'mongoose';

// Pre-register all Mongoose schemas to avoid MissingSchemaError during populates
import '../models/AdminUser.js';
import '../models/Media.js';
import '../models/Product.js';
import '../models/Enquiry.js';
import '../models/SiteSetting.js';
import '../models/Homepage.js';
import '../models/AuditLog.js';
import '../models/BlogPost.js';
import '../models/Document.js';
import '../models/FAQ.js';
import '../models/Project.js';
import '../models/Testimonial.js';
import '../models/OTPVerification.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elisadecor');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
