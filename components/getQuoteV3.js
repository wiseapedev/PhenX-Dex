import {ethers} from 'ethers';
import QuoterABI from './abis/QuoterABI.json';
import {CHAINS} from './lib/constants.js';

async function getQuoteV3(tokenIn, tokenOut, parsedSellAmount, chain_id) {
  const provider = new ethers.JsonRpcProvider(CHAINS[chain_id].rpcUrl);
  const quoter = new ethers.Contract(
    CHAINS[chain_id].uniswapQuoterV3, // Uniswap V3 Quoter contract address
    QuoterABI,
    provider
  );
  console.log('quoter', quoter);

  const feeTiers = [500, 3000, 10000];
  let highestQuote = null;

  if (
    tokenIn !== CHAINS[chain_id].wethAddress &&
    tokenOut !== CHAINS[chain_id].wethAddress
  ) {
    // Step 1: Quote tokenIn to WETH
    let intermediateWethAmount = null;
    let feeIn = 0;
    let feeOut = 0;
    for (const fee of feeTiers) {
      try {
        const amountOut = await quoter.quoteExactInputSingle.staticCall({
          tokenIn: tokenIn,
          tokenOut: CHAINS[chain_id].wethAddress,
          fee: fee,
          amountIn: BigInt(parsedSellAmount),
          sqrtPriceLimitX96: 0,
        });

        console.log(
          'Intermediate WETH fee tier',
          fee,
          'amountOut',
          amountOut[0]
        );

        if (!intermediateWethAmount || amountOut[0] > intermediateWethAmount) {
          intermediateWethAmount = amountOut[0];
          feeIn = fee;
        }
      } catch (error) {
        console.log(
          `Error getting intermediate WETH quote for fee tier ${fee}:`,
          error
        );
      }
    }

    if (!intermediateWethAmount) {
      console.log('Failed to get an intermediate WETH quote');
      return null;
    }

    // Step 2: Quote WETH to tokenOut
    for (const fee of feeTiers) {
      try {
        const amountOut = await quoter.quoteExactInputSingle.staticCall({
          tokenIn: CHAINS[chain_id].wethAddress,
          tokenOut: tokenOut,
          fee: fee,
          amountIn: intermediateWethAmount,
          sqrtPriceLimitX96: 0,
        });

        console.log('Final fee tier', fee, 'amountOut', amountOut[0]);

        if (!highestQuote || amountOut[0] > highestQuote.amountOut) {
          highestQuote = {
            amountOut: amountOut[0],
            fee: fee,
            feeIn: feeIn,
            feeOut: fee,
          };
        }
      } catch (error) {
        //   console.log(`Error getting final quote for fee tier ${fee}:`, error);
      }
    }
  } else {
    // Direct quote as before if either tokenIn or tokenOut is WETH
    for (const fee of feeTiers) {
      try {
        const amountOut = await quoter.quoteExactInputSingle.staticCall({
          tokenIn: tokenIn,
          tokenOut: tokenOut,
          fee: fee,
          amountIn: BigInt(parsedSellAmount),
          sqrtPriceLimitX96: 0,
        });

        console.log('Direct fee tier', fee, 'amountOut', amountOut[0]);

        if (
          amountOut[0] > 0 &&
          (!highestQuote || amountOut[0] > highestQuote.amountOut)
        ) {
          highestQuote = {
            amountOut: amountOut[0],
            fee: fee,
          };
        }
      } catch (error) {
        //     console.log(`Error getting quote for fee tier ${fee}:`, error);
      }
    }
  }

  if (highestQuote) {
    console.log('➡️➡️ Highest V3 quote found:', highestQuote);
    return highestQuote;
  } else {
    console.log(
      'Failed to get a quote for the final token using ETH equivalent'
    );
    return null; // Return null if no quote found for any fee tier
  }
}

export default getQuoteV3;
