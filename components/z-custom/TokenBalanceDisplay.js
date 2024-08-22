import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

// Define the component
const TokenBalanceDisplay = ({ tokenAddress, account }) => {
  const [balance, setBalance] = useState('...')
  const [error, setError] = useState('')

  useEffect(() => {
    // ERC20 token ABI
    const ERC20ABI = [
      'function decimals() view returns (uint8)',
      'function balanceOf(address) view returns (uint)',
      'function symbol() view returns (string)',
      'function totalSupply() view returns (uint)',
      'function approve(address spender, uint amount) external returns (bool)',
    ]

    // The RPC URL for Ethereum mainnet; replace it with your own RPC URL
    const RPC = process.env.REACT_APP_QUICKNODE_MAINNET_RPC_URL

    const getTokenBalance = async (tokenAddress, account) => {
      try {
        // Connect to the Ethereum network
        const provider = new ethers.providers.JsonRpcProvider(RPC)
        if (tokenAddress === undefined) {
          let nativeTokenBalance = await provider.getBalance(account)
          nativeTokenBalance = ethers.utils.formatEther(nativeTokenBalance)
          nativeTokenBalance = Number(nativeTokenBalance).toFixed(9)
          return `${nativeTokenBalance}`
        }
        // Create a new contract instance
        const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider)

        // Fetch the token decimals
        const decimals = await tokenContract.decimals()

        // Fetch the account's token balance
        const balance = await tokenContract.balanceOf(account)

        // Convert the balance to a human-readable format
        let formattedBalance = ethers.utils.formatUnits(balance, decimals)
        formattedBalance = Number(formattedBalance).toFixed(2)

        return `${formattedBalance}`
      } catch (error) {
        console.error('Error fetching token balance:', error)
        throw new Error('Failed to fetch token balance')
      }
    }

    getTokenBalance(tokenAddress, account)
      .then(setBalance)
      .catch((error) => {
        setError(error.message)
        setBalance('0')
      })
  }, [tokenAddress, account])

  return <div>{balance}</div>
}

export default TokenBalanceDisplay

// Example usage (make sure to replace the tokenAddress and account with actual values in your application)
// <TokenBalanceDisplay tokenAddress="0xTokenAddress" account="0xAccountAddress" />
