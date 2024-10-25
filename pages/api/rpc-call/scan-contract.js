import {ethers} from 'ethers';
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';

const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains here as needed
};

// Retry function for provider initialization
async function initializeProvider(chain_id, retries = 3, delayMs = 3000) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);
    // Trigger a simple call to detect the network
    await provider.getNetwork();
    return provider;
  } catch (error) {
    if (retries > 0) {
      console.error(`Network detection failed, retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return initializeProvider(chain_id, retries - 1, delayMs);
    } else {
      throw new Error(`Failed to detect network after retries: ${error}`);
    }
  }
}

export default async function handler(req, res) {
  const middlewarePromise = new Promise((resolve, reject) => {
    rpcAuthMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  try {
    await middlewarePromise; // Ensure middleware completes successfully
    const {contractAddress, chain_id} = req.body;

    console.log(contractAddress, '${contractAddress}');
    console.log(chain_id, '${chain_id}');

    if (!contractAddress || !chain_id) {
      return res
        .status(400)
        .json({error: 'Missing contract address or chain_id'});
    }

    // Initialize provider with retry logic
    const provider = await initializeProvider(chain_id);

    // Send the gp_tokenSecurity request
    const response = await provider.send('gp_tokenSecurity', [contractAddress]);
    const result = response[contractAddress.toLowerCase()];

    if (!result) {
      return res.status(404).json({error: 'No data found for this contract'});
    }

    // Return the result
    return res.status(200).json({result});
  } catch (error) {
    console.error('Error scanning contract:', error);
    return res.status(500).json({error: 'Failed to scan contract'});
  }
}
