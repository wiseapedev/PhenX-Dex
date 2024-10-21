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
  // Apply middleware and wait for completion or error
  const middlewarePromise = new Promise((resolve, reject) => {
    rpcAuthMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  try {
    await middlewarePromise; // Ensure middleware completes successfully

    const {chain_id} = req.body;

    if (!chain_id || !RPC_URLS[chain_id]) {
      return res.status(400).json({error: 'Invalid or missing chain_id'});
    }

    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);
    const blockNumber = await provider.getBlockNumber();

    // Return the block number as a string
    return res.status(200).json({blockNumber: blockNumber.toString()});
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({error: 'Failed to fetch block number'});
  }
}
