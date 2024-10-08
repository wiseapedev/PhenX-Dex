import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method Not Allowed'});
  }

  const {chain_id, account} = req.body;

  if (!chain_id || !account) {
    return res.status(400).json({message: 'Missing chain_id or account'});
  }

  try {
    const options = {
      headers: {
        Authorization: 'Bearer cqt_wFHvJbHgXtmywv3QkRY7YkhRHyGr', // Replace with your Covalent API key
      },
    };

    const response = await axios.get(
      `https://api.covalenthq.com/v1/${chain_id}/address/${account}/balances_v2/`,
      options
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    const userTokens = response.data.data.items;
    res.status(200).json({userTokens});
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error fetching token balances', error: error.message});
  }
}
