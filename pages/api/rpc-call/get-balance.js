// pages/api/rpc-call/get-balance.js
import {ethers} from 'ethers';
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';
export const runtime = 'edge';
// Define a mapping of chain IDs to their corresponding RPC URLs
const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains here as needed
};

export default async function handler(req, res) {
  const middlewarePromise = new Promise((resolve, reject) => {
    rpcAuthMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  try {
    await middlewarePromise; // Ensure middleware completes successfully
    const {chain_id, account} = req.body;

    // Validate request parameters
    if (!chain_id || !RPC_URLS[chain_id] || !account) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    // Create a provider based on the chain_id
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);

    // Fetch the balance for the given account
    const balance = await provider.getBalance(account);

    // Return the balance in a human-readable format (convert from Wei)
    res.status(200).json({balance: balance.toString()});
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({error: 'Failed to fetch balance'});
  }
}
