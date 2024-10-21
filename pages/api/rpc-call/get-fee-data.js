// pages/api/rpc-call/get-fee-data.js
import {ethers} from 'ethers';
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';
export const runtime = 'experimental-edge';
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

    const {chain_id} = req.body;

    // Validate request parameters
    if (!chain_id || !RPC_URLS[chain_id]) {
      return res.status(400).json({error: 'Invalid or missing chain_id'});
    }

    // Create a provider based on the chain_id
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);

    // Get the fee data (gas price, maxFeePerGas, etc.)
    const feeData = await provider.getFeeData();

    // Send the fee data back as a response
    res.status(200).json({feeData});
  } catch (error) {
    console.error('Error fetching fee data:', error);
    res.status(500).json({error: 'Failed to fetch fee data'});
  }
}
