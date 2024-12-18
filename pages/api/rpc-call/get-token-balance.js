// pages/api/rpc-call/get-token-balance.js
import {ethers} from 'ethers';
import erc20Abi from './abis/erc20.json'; // Assuming your ERC-20 ABI is here
import {rpcAuthMiddleware} from '../middleware/rpcAuthMiddleware';
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
    const {chain_id, account, tokenAddress} = req.body;

    // Validate request parameters
    if (!chain_id || !RPC_URLS[chain_id] || !account || !tokenAddress) {
      return res.status(400).json({error: 'Invalid or missing parameters'});
    }

    // Create a provider based on the chain_id
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain_id]);

    // Create an ERC-20 contract instance
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    // Fetch the token balance for the given account
    const tokenBalance = await tokenContract.balanceOf(account);
    if (tokenBalance) {
      console.log('Token Balance:', tokenBalance.toString());
    }

    // Return the balance as a string (BigInt issue fix)
    return res.status(200).json({tokenBalance: tokenBalance.toString()});
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return res.status(500).json({error: 'Failed to fetch token balance'});
  }
}
