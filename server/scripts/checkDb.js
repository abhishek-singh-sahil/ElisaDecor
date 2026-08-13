import 'dotenv/config';
import mongoose from 'mongoose';
import '../models/AdminUser.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elisadecor';

try {
  await mongoose.connect(MONGODB_URI);
  const count = await mongoose.model('AdminUser').countDocuments();
  console.log(count);
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.log('-1');
  process.exit(1);
}
