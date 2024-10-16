// middleware/throttleRateLimiter.js
import rateLimit from 'express-rate-limit';

// Throttling logic instead of rejecting
export const throttleRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 1000, // Allow 10 requests per minute
  keyGenerator: (req) => req.ip, // Rate limit based on IP, or you can change it
  handler: async (req, res, next) => {
    // When the limit is hit, introduce a delay instead of rejecting
    const delayMs = 500; // Delay by 1 second for each extra request

    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Log that the user has been throttled
    console.log(`Throttling IP: ${req.ip}`);

    // Allow the request to proceed after delay
    next();
  },
  // Disable sending the `429` status by default
  standardHeaders: false,
  legacyHeaders: false,
});
