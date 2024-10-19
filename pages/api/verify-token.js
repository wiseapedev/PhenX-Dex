import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Create a rate limiter to prevent excessive requests from the same IP or wallet address
const verifyTokenRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // Limit each IP to 10 requests per minute
  keyGenerator: (req) => req.headers.authorization || req.ip, // Rate limit by token or fallback to IP
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
    });
  },
});

export default function handler(req, res) {
  verifyTokenRateLimiter(req, res, () => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({message: 'Unauthorized: No token provided'});
    }
    //  return res.status(200).json({isValid: false});

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT);

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp > now) {
        return res.status(200).json({isValid: true});
      } else {
        return res.status(200).json({isValid: false});
      }
    } catch (error) {
      return res.status(500).json({error: 'Failed to verify token'});
    }
  });
}
