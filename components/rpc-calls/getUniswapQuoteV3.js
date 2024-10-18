async function getUniswapQuoteV3(
  tokenIn,
  tokenOut,
  parsedSellAmount,
  chain_id,
  authToken
) {
  try {
    if (!tokenIn || !tokenOut || !parsedSellAmount || !chain_id) {
      //  console.error('Invalid or missing parameters for Uniswap V3 quote');
      return null;
    }
    const response = await fetch('/api/rpc-call/get-quote-v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Pass authToken dynamically if needed
      },
      body: JSON.stringify({
        tokenIn,
        tokenOut,
        parsedSellAmount: parsedSellAmount.toString(), // Convert BigInt to string for sending over JSON
        chain_id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Highest Uniswap V3 Quote:', data.highestQuote);
      return data.highestQuote;
    } else {
      //  console.error('Error getting Uniswap V3 quote:', data.error);
      return null;
    }
  } catch (error) {
    // console.error('Failed to fetch Uniswap V3 quote:', error);
    return null;
  }
}

export default getUniswapQuoteV3;
