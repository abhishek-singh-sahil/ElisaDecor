import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import helmet from 'helmet';
import { generalLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Hardening ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

app.use('/api', generalLimiter);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow curl/server-to-server requests (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Static uploads (local dev fallback) ─────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── SEO routes (sitemap.xml / robots.txt) ───────────────────────────────────
app.use('/', seoRoutes);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', enquiryRoutes);
app.use('/api', productRoutes);
app.use('/api', homepageRoutes);
app.use('/api', mediaRoutes);
app.use('/api', settingsRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Elisa Decor API Server running on port ${PORT}`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   API:     http://localhost:${PORT}/api`);
    console.log(`   Client:  ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
  });
});
