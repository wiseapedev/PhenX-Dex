// pages/api/rpc-call/get-token-data.js
import {ethers} from 'ethers';
import erc20Abi from './abis/erc20.json'; // Assuming your ERC-20 ABI is here
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';

const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
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
    const {chain_id, tokenAddress} = req.body;

    if (!chain_id || !RPC_URLS[chain_id] || !tokenAddress) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    // Create a provider based on the chain_id
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);

    // Create the ERC-20 token contract instance
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    // Fetch the token information
    const [symbol, name, decimals] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals(),
    ]);

    // Return the token data as an object
    res.status(200).json({
      chain_id,
      name,
      symbol,
      address: tokenAddress,
      decimals: typeof decimals === 'bigint' ? Number(decimals) : decimals,
      logo_uri: `https://i.ibb.co/PQjTqqW/phenxlogo-1.png`, // default logo
    });
  } catch (error) {
    console.error('Error fetching token data:', error);
    return res.status(500).json({error: 'Failed to fetch token data'});
  }
}
