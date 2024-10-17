import jwt from 'jsonwebtoken';
import {ethers} from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {message, signature, walletAddress} = req.body;

  if (!message || !signature || !walletAddress) {
    return res.status(400).json({error: 'Missing required parameters'});
  }

  try {
    // Ensure JWT secret is set
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
}
