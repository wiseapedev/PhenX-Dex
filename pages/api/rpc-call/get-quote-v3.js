import {ethers} from 'ethers';
import QuoterABI from './abis/QuoterABI.json';
import {throttleRateLimiter} from './throttleRateLimiter';
import {CHAINS} from './CHAINS';
const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains as needed
};

// API Route to get a Uniswap V3 quote
export default async function handler(req, res) {
  await throttleRateLimiter(req, res, async () => {
    const {tokenIn, tokenOut, parsedSellAmount, chain_id} = req.body;

    if (
      !chain_id ||
      !CHAINS[chain_id] ||
      !tokenIn ||
      !tokenOut ||
      !parsedSellAmount
    ) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);
      const quoter = new ethers.Contract(
        CHAINS[chain_id].uniswapQuoterV3,
        QuoterABI,
        provider
      );
      const feeTiers = [500, 3000, 10000];
      let highestQuote = null;

      if (
        tokenIn !== CHAINS[chain_id].wethAddress &&
        tokenOut !== CHAINS[chain_id].wethAddress
      ) {
        let intermediateWethAmount = null;
        let feeIn = 0;

        // Step 1: Quote tokenIn to WETH
        for (const fee of feeTiers) {
          const amountOut = await quoter.quoteExactInputSingle.staticCall({
            tokenIn,
            tokenOut: CHAINS[chain_id].wethAddress,
            fee,
            amountIn: BigInt(parsedSellAmount),
            sqrtPriceLimitX96: 0,
          });
          if (
            !intermediateWethAmount ||
            amountOut[0] > intermediateWethAmount
          ) {
            intermediateWethAmount = amountOut[0];
            feeIn = fee;
          }
        }

        // Step 2: Quote WETH to tokenOut
        for (const fee of feeTiers) {
          const amountOut = await quoter.quoteExactInputSingle.staticCall({
            tokenIn: CHAINS[chain_id].wethAddress,
            tokenOut,
            fee,
            amountIn: intermediateWethAmount,
            sqrtPriceLimitX96: 0,
          });

          if (!highestQuote || amountOut[0] > highestQuote.amountOut) {
            highestQuote = {
              amountOut: amountOut[0].toString(), // Convert BigInt to string
              feeIn,
              feeOut: fee,
            };
          }
        }
      } else {
        // Direct quote if tokenIn or tokenOut is WETH
        for (const fee of feeTiers) {
          const amountOut = await quoter.quoteExactInputSingle.staticCall({
            tokenIn,
            tokenOut,
            fee,
            amountIn: BigInt(parsedSellAmount),
            sqrtPriceLimitX96: 0,
          });

          if (!highestQuote || amountOut[0] > highestQuote.amountOut) {
            highestQuote = {
              amountOut: amountOut[0].toString(), // Convert BigInt to string
              fee,
            };
          }
        }
      }

      res.status(200).json({highestQuote});
    } catch (error) {
      //   console.error('Error fetching Uniswap V3 quote:', error);
      return res.status(500).json({error: 'Failed to get quote'});
    }
  });
}
