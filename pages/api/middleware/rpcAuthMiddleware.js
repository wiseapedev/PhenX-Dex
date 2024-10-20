import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const limitAmount = 500;

// Create a rate limiter that limits RPC requests by IP address (higher limits)
const rpcIpRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: limitAmount, // Limit each IP to 100 requests per minute for RPC routes
  keyGenerator: (req, res) => {
    return req.ip; // Use IP for rate limiting
  },
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Too many requests from this IP for RPC. Please try again later.',
    });
  },
});

// Create a rate limiter that limits RPC requests by wallet address (higher limits)
const rpcWalletRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: limitAmount, // Limit each wallet to 100 requests per minute for RPC routes
  keyGenerator: (req, res) => {
    return req.walletAddress;
  },
  handler: (req, res) => {
    return res.status(429).json({
      error:
        'Too many requests from this wallet for RPC. Please try again later.',
    });
  },
});
const rpcAuthTokenRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: limitAmount,
  keyGenerator: (req) => {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : '';
    return token;
  },
  handler: (req, res) => {
    return res.status(429).json({error: 'Too many requests from this token.'});
  },
});

// RPC Auth Middleware with higher limits
export async function rpcAuthMiddleware(req, res, next) {
  // Apply IP-based rate limiting for RPC requests
  rpcIpRateLimiter(req, res, async () => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({message: 'Unauthorized: No token provided'});
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
      // Verify the token using the Supabase JWT secret (synchronously)
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT);

      // Attach wallet address to the request object
      req.walletAddress = decoded.walletAddress;

      // Apply rate limiting based on wallet address for RPC requests
      await rpcWalletRateLimiter(req, res, async () => {
        await rpcAuthTokenRateLimiter(req, res, next); // Rate limit by token as well
      });
    } catch (error) {
      return res.status(401).json({message: 'Unauthorized: Invalid token'});
    }
  });
}
