// middleware/throttleRateLimiter.js
import rateLimit from 'express-rate-limit';
export const runtime = 'experimental-edge';
// Throttling logic instead of rejecting
export const throttleRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 500, // Allow 10 requests per minute
  keyGenerator: (req) => req.ip, // Rate limit based on IP, or you can change it
  handler: (req, res) => {
    return res
      .status(429)
      .json({message: 'Too many requests. Please try again later.'});
  },

  // Disable sending the `429` status by default
  standardHeaders: false,
  legacyHeaders: false,
});
