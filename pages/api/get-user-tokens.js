import axios from 'axios';
import authMiddleware from './middleware/auth';
export const runtime = 'edge';
export default async function handler(req, res) {
  // Use authentication middleware
  authMiddleware(req, res, async () => {
    // Ensure it's a POST request
    if (req.method !== 'POST') {
      return res.status(405).json({message: 'Method Not Allowed'});
    }

    // Extract chain_id and account from request body
    const {chain_id, account} = req.body;

    // Validate the input
    if (!chain_id || !account) {
      return res.status(400).json({message: 'Missing chain_id or account'});
    }

    try {
      const options = {
        headers: {
          Authorization: 'Bearer cqt_wFHvJbHgXtmywv3QkRY7YkhRHyGr', // Replace with your Covalent API key
        },
      };

      // Fetch token balances from Covalent API
      const response = await axios.get(
        `https://api.covalenthq.com/v1/${chain_id}/address/${account}/balances_v2/`,
        options
      );

      // Check for a successful response
      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }

      // Extract token balances and send as response
      const userTokens = response.data.data.items;
      res.status(200).json({userTokens});
    } catch (error) {
      // Handle any errors during the API request
      res
        .status(500)
        .json({message: 'Error fetching token balances', error: error.message});
    }
  });
}
