import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Create a rate limiter that limits requests by wallet address
const walletRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each wallet to 5 requests per windowMs
  keyGenerator: (req, res) => {
    // Use wallet address for rate limiting
    return req.walletAddress || req.ip; // fallback to IP if walletAddress is not available
  },
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Too many requests from this wallet. Please try again later.',
    });
  },
});

// Combined Auth and Rate Limiting Middleware
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Unauthorized: No token provided'});
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    // Verify the token using the same Supabase JWT secret
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT);

    // Attach wallet address to the request object
    req.walletAddress = decoded.walletAddress;

    // Apply rate limiting using wallet address
    walletRateLimiter(req, res, next); // Rate limit requests based on wallet address
  } catch (error) {
    return res.status(401).json({message: 'Unauthorized: Invalid token'});
  }
}
