// auth.js

import jwt from 'jsonwebtoken';
import {ethers} from 'ethers';

export default async function handler(req, res) {
  const {message, signature, walletAddress} = req.body;
  console.log('Message:', message);
  console.log('Signature:', signature);
  console.log('Wallet address:', walletAddress);

  try {
    // Check if SUPABASE_JWT is available
    if (!process.env.SUPABASE_JWT) {
      return res
        .status(500)
        .json({error: 'JWT secret not found in environment variables'});
    }

    // Verify the signature using ethers.js
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Debug the recovered and actual wallet addresses
    console.log('Recovered address:', recoveredAddress);
    console.log('Wallet address:', walletAddress);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({error: 'Unauthorized: Invalid signature'});
    }

    // Generate a JWT token using the Supabase JWT secret
    const token = jwt.sign({walletAddress}, process.env.SUPABASE_JWT, {
      expiresIn: '12h', // Token expires in 1 hour
    });

    // Send the token back to the frontend
    return res.status(200).json({token});
  } catch (error) {
    console.error('Error verifying signature or signing JWT:', error);
    return res.status(500).json({error: 'Authentication failed'});
  }
}
