// pages/api/rpc-call/get-block-number.js
import {ethers} from 'ethers';
import {throttleRateLimiter} from './throttleRateLimiter';

// Define a mapping of chain IDs to their corresponding RPC URLs
const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains here...
};

export default async function handler(req, res) {
  await throttleRateLimiter(req, res, async () => {
    const {chain_id} = req.body;

    if (!chain_id || !RPC_URLS[chain_id]) {
      return res.status(400).json({error: 'Invalid or missing chain_id'});
    }

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);
      const blockNumber = await provider.getBlockNumber();

      // Return the block number as a string
      return res.status(200).json({blockNumber: blockNumber.toString()});
    } catch (error) {
      console.error('Error fetching block number:', error);
      return res.status(500).json({error: 'Failed to fetch block number'});
    }
  });
}
