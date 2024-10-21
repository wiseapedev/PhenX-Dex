import {ethers} from 'ethers';
import QuoterABI from './abis/QuoterABI.json';
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';
import {CHAINS} from './CHAINS';
export const runtime = 'experimental-edge';
const RPC_URLS = {
  1: process.env.ETH_RPC, // Ethereum Mainnet
  8453: process.env.BASE_RPC, // Base
  // Add more chains as needed
};

// API Route to get a Uniswap V3 quote
export default async function handler(req, res) {
  const middlewarePromise = new Promise((resolve, reject) => {
    rpcAuthMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  try {
    await middlewarePromise; // Ensure middleware completes successfully
    const {tokenIn, tokenOut, parsedSellAmount, chain_id} = req.body;

    // Check for missing parameters
    if (
      !chain_id ||
      !CHAINS[chain_id] ||
      !tokenIn ||
      !tokenOut ||
      !parsedSellAmount
    ) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);
    const quoter = new ethers.Contract(
      CHAINS[chain_id].uniswapQuoterV3, // Uniswap V3 Quoter contract address
      QuoterABI,
      provider
    );

    const feeTiers = [500, 3000, 10000];
    let highestQuote = null;

    // Check if the tokens require an intermediate WETH swap
    if (
      tokenIn !== CHAINS[chain_id].wethAddress &&
      tokenOut !== CHAINS[chain_id].wethAddress
    ) {
      let intermediateWethAmount = null;
      let feeIn = 0;

      // Step 1: Quote tokenIn to WETH
      for (const fee of feeTiers) {
        try {
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
        } catch (error) {
          /*             console.error(
              `Error getting intermediate WETH quote for fee tier ${fee}:`,
              error
            ); */
        }
      }

      // Step 2: Quote WETH to tokenOut
      if (intermediateWethAmount) {
        for (const fee of feeTiers) {
          try {
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
          } catch (error) {
            /*      console.error(
                `Error getting final quote for fee tier ${fee}:`,
                error
              ); */
          }
        }
      } else {
        console.log('Failed to get an intermediate WETH quote');
        return res
          .status(500)
          .json({error: 'Failed to get intermediate WETH quote'});
      }
    } else {
      // Direct quote if tokenIn or tokenOut is WETH
      for (const fee of feeTiers) {
        try {
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
        } catch (error) {
          //     console.error(`Error getting quote for fee tier ${fee}:`, error);
        }
      }
    }

    // Return the highest quote found
    if (highestQuote) {
      console.log('Highest V3 quote found:', highestQuote);
      return res.status(200).json({highestQuote});
    } else {
      return res.status(500).json({error: 'No valid quote found'});
    }
  } catch (error) {
    // console.error('Error fetching Uniswap V3 quote:', error);
    return res.status(500).json({error: 'Failed to get quote'});
  }
}
