// pages/api/rpc-call/get-amounts-out.js
import {ethers} from 'ethers';
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';
import {CHAINS} from './CHAINS';
import uniswapRouterABI from './abis/UniswapRouter.json';
import RPC_URLS from './RPC_URLS';

export default async function handler(req, res) {
  const middlewarePromise = new Promise((resolve, reject) => {
    rpcAuthMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  try {
    await middlewarePromise; // Ensure middleware completes successfully

    const {chain_id, amountIn, path, uniswapRouterAddress} = req.body;

    // Validate request parameters
    if (
      !chain_id ||
      !RPC_URLS[chain_id] ||
      !amountIn ||
      !path ||
      !uniswapRouterAddress
    ) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    // Create a provider based on the chain_id
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);

    // Uniswap Router contract ABI

    // Create the contract instance using the provided uniswapRouterAddress
    const routerContract = new ethers.Contract(
      uniswapRouterAddress,
      uniswapRouterABI,
      provider
    );

    // Call the getAmountsOut function from the UniswapV2 router
    const amounts = await routerContract.getAmountsOut(amountIn, path);
    const amountsOut = amounts.map((amount) => amount.toString());
    // Respond with the amounts output
    return res.status(200).json({amounts: amountsOut});
  } catch (error) {
    //   console.error('Error fetching amounts out:', error);
    return res.status(500).json({error: 'Failed to fetch amounts out'});
  }
}
