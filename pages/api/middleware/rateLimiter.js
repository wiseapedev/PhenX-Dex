import rateLimit from 'express-rate-limit';
const ipRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 10, // Limit each IP to 10 requests per minute
  handler: (req, res) => {
    return res
      .status(429)
      .json({error: 'Too many requests, please try again later.'});
  },
});

// Wallet address-based rate limiter
export const walletRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 5, // Limit each wallet to 5 requests per minute
  keyGenerator: (req, res) => {
    return req.body.walletAddress || req.ip; // Use wallet address or fallback to IP
  },
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Too many requests from this wallet. Please try again later.',
    });
  },
});
