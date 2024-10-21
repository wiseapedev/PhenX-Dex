// pages/api/rpc-call/get-gas-price.js
import {ethers} from 'ethers';
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';
export const runtime = 'edge';
// Define a mapping of chain IDs to their corresponding RPC URLs
const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains as needed
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

    // Prepare the payload for the custom gas price request (bn_gasPrice in your case)
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'bn_gasPrice', // Custom method for your gas price
      params: [{chainid: chain_id}], // Adjust if you need different params
    };

    // Send the custom payload to the RPC
    const gasPrice = await provider.send(payload.method, payload.params);

    res.status(200).json({gasPrice});
  } catch (error) {
    console.error('Error fetching gas price:', error);
    res.status(500).json({error: 'Failed to fetch gas price'});
  }
}
