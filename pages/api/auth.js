import jwt from 'jsonwebtoken';
import {ethers} from 'ethers';
import rateLimit from 'express-rate-limit';
export const runtime = 'experimental-edge';
// Create a rate limiter to prevent excessive requests by IP and wallet address
const walletRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 10, // limit each wallet and IP to 10 requests per minute
  keyGenerator: (req, res) => {
    // Use both wallet address and IP for rate limiting
    return req.ip; // combine wallet address and IP
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

    const {walletAddress} = req.body;
    if (!walletAddress) {
      return res.status(400).json({message: 'Wallet address is required'});
    }

    try {
      // Generate JWT token with the wallet address
      const token = jwt.sign({walletAddress}, process.env.SUPABASE_JWT, {
        expiresIn: '12h', // Token expires in 12 hours
      });

      // Send the token back to the frontend
      return res.status(200).json({token});
    } catch (error) {
      return res.status(500).json({error: 'Authentication failed'});
    }
  });
}
