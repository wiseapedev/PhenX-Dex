async function getAmountOutV2(chain_id, amountIn, path, uniswapRouterAddress) {
  try {
    if (!amountIn || !path || !uniswapRouterAddress) {
      return null;
    }
    // Make the POST request to the backend API
    const response = await fetch('/api/rpc-call/get-amounts-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chain_id, // Chain ID (e.g., Ethereum Mainnet = 1)
        amountIn: amountIn.toString(), // Convert BigInt to string before sending
        path, // Path of token addresses
        uniswapRouterAddress, // Uniswap Router Address
      }),
    });

    const data = await response.json(); // Parse the response data

    if (response.ok) {
      console.log('Swap amounts:', data.amounts);
      return data.amounts;
    } else {
      // console.error('Error:', data.error); // Handle error if any
    }
  } catch (error) {
    // console.error('Error fetching swap amounts:', error); // Catch any fetch errors
    return null;
  }
}
export default getAmountOutV2;
