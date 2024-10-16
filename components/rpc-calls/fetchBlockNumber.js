async function fetchBlockNumber(chain_id) {
  try {
    if (!chain_id) {
      //  console.error('Invalid or missing parameters for block number');
      return null;
    }
    const response = await fetch('/api/rpc-call/get-block-number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({chain_id}), // Pass chain_id dynamically
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Block Number:', data.blockNumber);
      return data.blockNumber; // Return the block number if needed elsewhere
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Failed to fetch block number:', error);
  }
}
export default fetchBlockNumber;
