// pages/index.js

import {useState, useEffect, useContext} from 'react';
import {ethers} from 'ethers';
import {BlockchainContext} from '../../components/BlockchainContext';

export default function ListingPage() {
  const {provider} = useContext(BlockchainContext);
  const [contractAddress, setContractAddress] = useState('');
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [contractExists, setContractExists] = useState(false);

  // Fetch token details and check if contract exists when contract address is entered
  const handleContractAddressChange = async (e) => {
    const address = e.target.value.trim();
    setContractAddress(address);

    if (ethers.utils.isAddress(address)) {
      await fetchTokenDetails(address);
      await checkContractExists(address);
    } else {
      setIsReady(false);
      setContractExists(false);
    }
  };

  // Fetch token details
  const fetchTokenDetails = async (address) => {
    try {
      const tokenContract = new ethers.Contract(
        address,
        [
          // ERC-20 Standard ABI functions
          'function name() view returns (string)',
          'function symbol() view returns (string)',
        ],
        provider
      );

      const tokenName = await tokenContract.name();
      const tokenSymbol = await tokenContract.symbol();

      setName(tokenName);
      setTicker(tokenSymbol);
    } catch (error) {
      console.error('Error fetching token details:', error);
      alert(
        'Error fetching token details. Please ensure the contract address is correct.'
      );
      setIsReady(false);
    }
  };

  // Check if the contract address exists in the database
  const checkContractExists = async (address) => {
    try {
      const response = await fetch('/api/check-contract', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({contractAddress: address}),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.exists) {
          setContractExists(true);
          setIsReady(false);
          alert('This contract address is already listed.');
        } else {
          setContractExists(false);
          setIsReady(true);
        }
      } else {
        console.error('Error checking contract:', result.message);
        alert('Error checking contract. Please try again later.');
        setIsReady(false);
      }
    } catch (error) {
      console.error('Error checking contract existence:', error);
      alert('Error checking contract existence. Please try again later.');
      setIsReady(false);
    }
  };

  const handlePay = async () => {
    try {
      if (!provider) {
        throw new Error('Ethereum provider not found.');
      }

      // Request user's wallet to connect
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      // Define the payment amount (e.g., in ETH)
      const paymentAmount = ethers.utils.parseEther('0.1'); // 0.1 ETH

      // Send payment to your address
      const tx = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS, // Replace with your receiving address
        value: paymentAmount,
      });

      console.log('Transaction sent:', tx);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction mined:', receipt);

      // Verify the transaction details
      if (
        receipt.to.toLowerCase() !==
          process.env.NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS.toLowerCase() ||
        !receipt.status
      ) {
        alert('Transaction failed or sent to incorrect address.');
        return;
      }

      // Prepare data for API call
      const listingData = {
        contractAddress,
        name,
        ticker,
        imgUrl,
        trxHash: receipt.transactionHash,
      };

      // Call API to add listing
      const response = await fetch('/api/pay-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Listing added successfully!');
        // Reset form
        setContractAddress('');
        setName('');
        setTicker('');
        setImgUrl('');
        setIsReady(false);
        setContractExists(false);
      } else {
        alert('Error adding listing: ' + result.message);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Payment failed: ' + error.message);
    }
  };

  return (
    <div style={{padding: '20px'}}>
      <div>
        <div>Contract Address:</div>
        <div>
          <input
            type='text'
            value={contractAddress}
            onChange={handleContractAddressChange}
            placeholder='Paste Contract Address'
            style={{width: '300px'}}
          />
        </div>
      </div>

      <div>
        <div>Name:</div>
        <div>
          <input type='text' value={name} disabled style={{width: '300px'}} />
        </div>
      </div>

      <div>
        <div>Ticker:</div>
        <div>
          <input type='text' value={ticker} disabled style={{width: '300px'}} />
        </div>
      </div>

      <div>
        <div>Image URL:</div>
        <div>
          <input
            type='text'
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder='Optional Image URL'
            style={{width: '300px'}}
          />
        </div>
      </div>

      <div style={{marginTop: '20px'}}>
        <button onClick={handlePay} disabled={!isReady || contractExists}>
          Pay and List
        </button>
      </div>

      {contractExists && (
        <div style={{color: 'red', marginTop: '10px'}}>
          This contract address is already listed.
        </div>
      )}
    </div>
  );
}
