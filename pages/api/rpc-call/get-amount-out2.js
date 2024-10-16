// pages/api/rpc-call/get-amount-out2.js
import {ethers} from 'ethers';
import {throttleRateLimiter} from './throttleRateLimiter';
import uniswapRouterABI from './abis/UniswapRouter.json';

// Define a mapping of chain IDs to their corresponding RPC URLs
const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains here as needed
};

export default async function handler(req, res) {
  await throttleRateLimiter(req, res, async () => {
    const {
      chain_id,
      tokenAddress,
      wethAddress,
      tokenBalance,
      uniswapRouterAddress,
    } = req.body;

    // Validate request parameters
    if (
      !chain_id ||
      !RPC_URLS[chain_id] ||
      !tokenAddress ||
      !wethAddress ||
      !tokenBalance ||
      !uniswapRouterAddress
    ) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    try {
      // Create a provider based on the chain_id
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);

      // Create the UniswapV2 Router contract instance
      const routerContract = new ethers.Contract(
        uniswapRouterAddress,
        uniswapRouterABI,
        provider
      );

      // Define the swap path [tokenAddress -> wethAddress]
      const path = [tokenAddress, wethAddress];

      // Call the getAmountsOut function to calculate the token swap output
      const amountsOut = await routerContract.getAmountsOut(tokenBalance, path);

      // Respond with the amounts output
      res.status(200).json({amountsOut});
    } catch (error) {
      console.error('Error fetching amounts out:', error);
      res.status(500).json({error: 'Failed to fetch amounts out'});
    }
  });
}
