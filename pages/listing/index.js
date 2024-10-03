// pages/index.js

import {useState, useEffect, useContext, useMemo} from 'react';
import {ethers} from 'ethers';
import {BlockchainContext} from '../../components/BlockchainContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import PendingTransaction from '../../components/PendingTransaction';

import {erc20Abi} from 'viem';

export default function ListingPage() {
  const {provider, account, chain_id, signer} = useContext(BlockchainContext);
  const [contractAddress, setContractAddress] = useState('');
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [contractExists, setContractExists] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(false);

  const listFeeAddress = '0x94683fd6256DaC7203D2994cf1fe1E8dA5fb7648';
  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    if (!account || !provider || chain_id !== 1) {
      setIsConnected(false);
    } else {
      setIsConnected(true);
    }
  }, [account, provider, chain_id]);

  // Fetch token details and check if contract exists when contract address is entered
  const handleContractAddressChange = async (e) => {
    const address = e.target.value.trim();
    setContractAddress(address);

    if (ethers.isAddress(address)) {
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
      if (!provider) {
        console.error('Provider not initialized.');
        alert('Ethereum provider not initialized. Please try again.');
        return;
      }
      console.log('Fetching token details for:', address);

      const tokenContract = new ethers.Contract(address, erc20Abi, provider);

      const tokenName = await tokenContract.name();
      const tokenSymbol = await tokenContract.symbol();
      console.log('Token details:', tokenName, tokenSymbol);

      setName(tokenName);
      setTicker(tokenSymbol);
      setIsReady(true);
    } catch (error) {
      console.error('Error fetching token details:', error);
      alert(
        'Error fetching token details. Please ensure the contract address is correct and the token implements ERC-20 standards.'
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

      // Define the payment amount (e.g., in ETH)
      const paymentAmount = ethers.parseEther('0.05'); // 0.1 ETH

      // Send payment to your address
      const tx = await signer.sendTransaction({
        to: listFeeAddress,
        value: paymentAmount,
      });

      console.log('Transaction sent:', tx);
      setPendingTransaction(tx);

      const sendTransaction = await tx.wait();
      console.log('Transaction mined:', sendTransaction);
      if (sendTransaction.status === 1) {
        alert('Transaction successful!');
      }
      if (sendTransaction.status === 0) {
        alert('Transaction failed. Please try again.');
      }

      // Verify the transaction details

      // Prepare data for API call
      const listingData = {
        contractAddress,
        name,
        ticker,
        imgUrl,
        trxHash: sendTransaction.hash,
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
    } finally {
      await delay(2000);
      setPendingTransaction(false);
    }
  };

  const memoNavBar = useMemo(() => {
    return <NavBar />;
  }, []);
  const memoFooter = useMemo(() => {
    return <Footer />;
  }, []);

  return (
    <div className='whole-container'>
      {memoNavBar}
      <div className='bg' />
      <div className='listing-container'>
        {pendingTransaction && (
          <PendingTransaction
            provider={provider}
            transaction={pendingTransaction}
            chainId={chain_id}
          />
        )}
        {!isConnected && (
          <div className='wrong-network-container'>
            <div className='wrong-network-text'>
              Please connect your wallet to ETH list a token.
            </div>
          </div>
        )}
        <div className={isConnected ? 'swap-container' : 'swap-container blur'}>
          {/* Contract Address Input */}
          <div className='flex-row'>
            <div className='listing-text info-box-title'>Contract Address:</div>
            <div className='small-text'></div>
          </div>
          <div className='token-input-box'>
            <div className='flex-row'>
              <input
                type='text'
                value={contractAddress}
                onChange={handleContractAddressChange}
                placeholder='Paste Contract Address'
                className='listing-input'
              />
            </div>
          </div>

          {/* Name Input */}
          <div className='flex-row'>
            <div className='listing-text info-box-title'>Name:</div>
            <div className='small-text'></div>
          </div>
          <div className='token-input-box'>
            <div className='flex-row'>
              <input
                type='text'
                value={name}
                disabled
                className='listing-input'
              />
            </div>
          </div>

          {/* Ticker Input */}
          <div className='flex-row'>
            <div className='listing-text info-box-title'>Ticker:</div>
            <div className='small-text'></div>
          </div>
          <div className='token-input-box'>
            <div className='flex-row'>
              <input
                type='text'
                value={ticker}
                disabled
                className='listing-input'
              />
            </div>
          </div>

          {/* Image URL Input */}
          <div className='flex-row'>
            <div className='listing-text info-box-title'>Logo URL:</div>
            <div className='small-text'></div>
          </div>
          <div className='token-input-box'>
            <div className='flex-row'>
              <input
                type='text'
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder='Use any link or the upload button'
                className='listing-input'
              />
              <a
                href='https://imgbb.com/'
                target='_blank'
                rel='noreferrer'
                className='listing-url'>
                Upload
              </a>
            </div>
          </div>

          {/* Pay and List Button */}
          <div style={{marginTop: '20px'}}>
            <button
              className={
                !isReady || contractExists
                  ? 'swap-button disable'
                  : 'swap-button'
              }
              onClick={handlePay}
              disabled={!isReady || contractExists}>
              Pay 0.05 ETH
            </button>
          </div>

          {contractExists && (
            <div style={{color: 'red', marginTop: '10px'}}>
              This contract address is already listed or pending.
            </div>
          )}
        </div>
      </div>
      {memoFooter}
    </div>
  );
}
