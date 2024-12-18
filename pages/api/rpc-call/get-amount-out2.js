// pages/api/rpc-call/get-amount-out2.js
import {ethers} from 'ethers';
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';
import uniswapRouterABI from './abis/UniswapRouter.json';
import RPC_URLS from './RPC_URLS';

export default async function handler(req, res) {
  await rpcAuthMiddleware(req, res, async () => {
    const middlewarePromise = new Promise((resolve, reject) => {
      rpcAuthMiddleware(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    try {
      await middlewarePromise;

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
      //   console.error('Error fetching amounts out:', error);
      return res.status(500).json({error: 'Failed to fetch amounts out'});
    }
  });
}
