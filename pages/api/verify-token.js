import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
export const runtime = 'experimental-edge';
// Create a rate limiter
const verifyTokenRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Limit each IP/token to 20 requests per minute
  keyGenerator: (req) => req.headers.authorization || req.ip, // Rate limit by token or IP
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
    });
  },
});

// Helper function to verify token
async function verifyToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Unauthorized: No token provided'});
  }

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
    console.error('Token verification error:', error);
    return res.status(500).json({error: 'Failed to verify token'});
  }
}

// Main handler (ensure async)
export default async function handler(req, res) {
  // Wrap rate limiter in a promise to ensure it completes before continuing
  await new Promise((resolve) => {
    verifyTokenRateLimiter(req, res, resolve);
  });

  // Call the token verification function after rate limiting
  await verifyToken(req, res);
}
