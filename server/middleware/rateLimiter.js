import rateLimit from 'express-rate-limit';

// Strict Auth Limiter: Max 5 attempts per 15 minutes to block brute-force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again after 15 minutes.' },
});

// General API Limiter: Max 200 requests per 15 minutes to prevent DoS floods
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again after 15 minutes.' },
});
