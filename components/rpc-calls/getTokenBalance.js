async function getTokenBalance(chain_id, account, tokenAddress) {
  try {
    if (!chain_id || !account || !tokenAddress) {
      //  console.error('Invalid or missing parameters for token balance');
      return null;
    }
    const response = await fetch('/api/rpc-call/get-token-balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({chain_id, account, tokenAddress}),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Token Balance:', data.balance);
      return data.balance; // Return the balance for display or further use
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Failed to fetch token balance:', error);
  }
}
export default getTokenBalance;
