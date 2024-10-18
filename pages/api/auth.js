import jwt from 'jsonwebtoken';
import {ethers} from 'ethers';
import rateLimit from 'express-rate-limit';

// Create a rate limiter to prevent excessive requests by IP and wallet address
const walletRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 10, // limit each wallet and IP to 10 requests per minute
  keyGenerator: (req, res) => {
    // Use both wallet address and IP for rate limiting
    return `${req.walletAddress || ''}:${req.ip}`; // combine wallet address and IP
  },
  handler: (req, res) => {
    return res.status(429).json({
      error:
        'Too many requests from this wallet or IP. Please try again later.',
    });
  },
});

export default async function handler(req, res) {
  await walletRateLimiter(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({error: 'Method not allowed'});
    }

    const {message, signature, walletAddress} = req.body;

    if (!message || !signature || !walletAddress) {
      return res.status(400).json({error: 'Missing required parameters'});
    }

    try {
      if (!process.env.SUPABASE_JWT) {
        throw new Error('JWT secret not found in environment variables');
      }

      // Verify the message signature using ethers.js
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Ensure the recovered address matches the provided wallet address
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({error: 'Unauthorized: Invalid signature'});
      }

      // Generate JWT token with a 12-hour expiry
      const token = jwt.sign({walletAddress}, process.env.SUPABASE_JWT, {
        expiresIn: '12h',
      });

      // Respond with the JWT token
      return res.status(200).json({token});
    } catch (error) {
      console.error('Authentication error:', error.message || error);
      return res.status(500).json({error: 'Authentication failed'});
    }
  });
}
