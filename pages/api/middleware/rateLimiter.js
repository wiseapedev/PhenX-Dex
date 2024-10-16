import rateLimit from 'express-rate-limit';

export const walletRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each wallet to 5 requests per windowMs
  keyGenerator: (req, res) => {
    // Use wallet address instead of IP for rate limiting
    return req.walletAddress || req.ip; // fallback to IP if walletAddress is not available
  },
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Too many requests from this wallet. Please try again later.',
    });
  },
});
