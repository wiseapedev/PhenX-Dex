// pages/api/rpc-call/get-token-balance.js
import {ethers} from 'ethers';
import erc20Abi from './abis/erc20.json'; // Assuming your ERC-20 ABI is here
import {throttleRateLimiter} from './throttleRateLimiter';

// Define a mapping of chain IDs to their corresponding RPC URLs
const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains here as needed
};

export default async function handler(req, res) {
  await throttleRateLimiter(req, res, async () => {
    const {chain_id, account, tokenAddress} = req.body;

    // Validate request parameters
    if (!chain_id || !RPC_URLS[chain_id] || !account || !tokenAddress) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    try {
      // Create a provider based on the chain_id
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);

      // Create an ERC-20 contract instance
      const tokenContract = new ethers.Contract(
        tokenAddress,
        erc20Abi,
        provider
      );

      // Fetch the token balance for the given account
      const tokenBalance = await tokenContract.balanceOf(account);
      if (tokenBalance) {
        console.log('Token Balance:', tokenBalance.toString());
      }

      // Return the balance as a string (BigInt issue fix)
      return res.status(200).json({tokenBalance: tokenBalance.toString()});
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return res.status(500).json({error: 'Failed to fetch token balance'});
    }
  });
}
