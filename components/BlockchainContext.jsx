import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  use,
} from 'react';
import PropTypes from 'prop-types';
import {ethers} from 'ethers';
import axios from 'axios';
// import {useAccount} from 'wagmi';
import CryptoJS from 'crypto-js';

import ERC20ABI from './abis/erc20.json';
import uniswapRouterABI from './abis/UniswapRouter.json';
// import {useEthersProvider} from './provider';
import {useEthersSigner} from './signer';
import {erc20Abi} from 'viem';
import wethABI from './abis/wethABI.json';
// import {config} from '../config/config';
import mergeTokens from './mergeTokens';
import {CHAINS} from './lib/constants';
// import {ETH_TOKENS} from './lib/constants';
import {BASE_TOKENS} from './lib/constants';
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from '@web3modal/ethers/react';
// import {useAppKitProvider, useAppKitAccount} from '@reown/appkit/react';
// import {useAppKitState} from '@reown/appkit/react';
import fetchBlockNumber from './rpc-calls/fetchBlockNumber';
import {toast} from 'react-toastify';

import {useDisconnect} from '@web3modal/ethers/react';
import {ETH_TOKENS_DISPLAY} from './lib/constants';

import {BrowserProvider, Contract, formatUnits} from 'ethers';
import Bottleneck from 'bottleneck';

export const BlockchainContext = createContext({
  contractAddress: '',
  symbol: '',
  balance: 0,
  targetSymbol: '',
  tier: '',
});
// import delay from './delay';
async function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
export const BlockchainProvider = ({children}) => {
  // const provider = useEthersProvider();
  // const {address: account} = useAccount();
  //  const signer = useEthersSigner();
  // const {open, selectedNetworkId} = useAppKitState();
  /*   const limiter = useRef(
    new Bottleneck({
      maxConcurrent: 1, // Only allow 1 concurrent request
      minTime: 1000, // At least 200ms between requests
    })
  );
  const limit = (task) => limiter.current.schedule(task); */
  const bannedSymbols = ['WBNB', 'USD0 [www.usual.finance]', 'WETH'];

  const [ETH_TOKENS, setEthTokens] = useState({});
  const [ALL_TOKENS, setAllTokens] = useState({});
  const [chain_id, setChainId] = useState(1);

  const {walletProvider} = useWeb3ModalProvider();
  // const {walletProvider} = useAppKitProvider();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const {isConnected} = useWeb3ModalAccount();
  const {disconnect} = useDisconnect();

  const {address: account, chainId} = useWeb3ModalAccount();
  const selectedNetworkId = useMemo(() => chainId, [chainId]);
  const [authToken, setAuthToken] = useState(null);

  const authenticateCheckRef = useRef(false); // Persistent reference across renders

  const authenticate = async () => {
    if (isConnected && account) {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({walletAddress: account}),
        });

        const data = await response.json();
        if (data.token) {
          if (data.token !== authToken) {
            localStorage.setItem('authToken', data.token);
            setAuthToken(data.token);
            toast.success('Authentication successful');
          }
        } else {
          console.error('Authentication failed');
        }
      } catch (error) {
        console.error('Error authenticating:', error);
      }
    }
  };

  useEffect(() => {
    const authenticateCheck = async () => {
      authenticateCheckRef.current = true; // Set the flag to prevent overlapping calls

      if (isConnected && account) {
        await authenticate(); // Await the authenticate function to complete
      }

      authenticateCheckRef.current = false; // Reset the flag
    };

    if (!authenticateCheckRef.current && isConnected && account) {
      authenticateCheck(); // Trigger the async function
    }

    return () => {
      authenticateCheckRef.current = false; // Reset the flag on component unmount
    };
  }, [account, isConnected]); // Only triggers on account or connection state changes

  const isCheckingRef = useRef(false); // Persistent reference across renders

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (isCheckingRef.current) return; // Prevent overlapping checks
      if (authenticateCheckRef.current) return; // Skip if authentication is in progress
      isCheckingRef.current = true;

      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await fetch('/api/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (data && !data.isValid && isConnected && account) {
            disconnect();
            localStorage.removeItem('authToken');
            setAuthToken(null);
            toast.error('Authentication token expired. Please log in again.');
          } else if (data && data.isValid && isConnected && account) {
            if (token !== authToken) {
              setAuthToken(token);
            }
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
        } finally {
          isCheckingRef.current = false; // Reset the flag after completion
        }
      } else {
        isCheckingRef.current = false; // Reset flag if no token
      }
    };
    checkTokenValidity();
    const intervalId = setInterval(checkTokenValidity, 60000); // Poll every 15 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [isConnected, account]); // Add necessary dependencies

  useEffect(() => {
    if (selectedNetworkId) {
      if (selectedNetworkId !== chain_id) {
        if (selectedNetworkId === 8453) {
          setChainId(8453);
        } else if (selectedNetworkId === 1) {
          setChainId(1);
        } else if (selectedNetworkId === 56) {
          setChainId(56);
        }
      }
      console.log('selectedNetworkId', selectedNetworkId);
    }
  }, [selectedNetworkId]);

  function AuthButton({}) {
    const loginWithWallet = async () => {
      try {
        console.log('loginWithWallet called');

        if (!signer || !account) {
          console.error('Signer or account not available');
          return;
        }

        const message = `I am logging in to the platform. Wallet address: ${account}`;

        // Ethers.js v6: sign the message using the signer
        const signature = await signer.signMessage(message); // User signs the message

        // Send signed message and wallet address to the backend (without Authorization header)
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({message, signature, walletAddress: account}),
        });

        const data = await response.json();
        if (data.token) {
          setAuthToken(data.token); // Store JWT token for future requests
          console.log('Auth token received:', data.token);
        } else {
          console.error('Authentication failed');
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    return (
      <button className='swap-button' onClick={loginWithWallet}>
        Click Here
      </button>
    );
  }

  const fetchWalletTokensAndFormat = async (tokensDB) => {
    if (!authToken) return;
    const tokensDbLength = Object.keys(tokensDB).length;

    try {
      const response = await fetch('/api/get-user-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
        },

        body: JSON.stringify({chain_id, account}),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('data', data);
      const userTokens = data.userTokens;
      console.log('userTokens', userTokens);

      const formattedUserTokens = userTokens
        .filter(
          (token) =>
            !Object.values(tokensDB).some(
              (dbToken) => dbToken.symbol === token.contract_ticker_symbol
            ) && !bannedSymbols.includes(token.contract_ticker_symbol)
        )
        .map((token, index) => ({
          address: token.contract_address,
          chain_id: chain_id,
          decimals: token.contract_decimals,
          id: tokensDbLength + index, // Start IDs from the length of tokensDB
          is_partner: tokensDB[token.contract_address]?.is_partner || false,
          is_v2: tokensDB[token.contract_address]?.is_v2 || false,
          logo_uri: 'https://i.ibb.co/cT4kT4T/phenxlogo-1.png',
          name: token.contract_name,
          symbol: token.contract_ticker_symbol,
        }));

      // Merge user tokens with tokensDB
      const mergedTokens = {...tokensDB};

      formattedUserTokens.forEach((token) => {
        mergedTokens[token.id] = token; // Use `id` as the key for merged tokens
      });

      return mergedTokens;
    } catch (err) {
      console.error('Error fetching token balances:', err);
      return tokensDB;
    }
  };
  /*   useEffect(() => {
    if (!account) return;
    setEthTokens({});
  }, [chain_id, account]);
 */
  const isFetching = useRef(false); // useRef to persist across renders

  useEffect(() => {
    const fetchTokens = async () => {
      if (isFetching.current || !authToken || !account) return;

      try {
        isFetching.current = true; // Set the flag to prevent double fetching

        const res = await fetch('/api/tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
          },
          body: JSON.stringify({chain_id, account}),
        });

        const tokensDB = await res.json();
        const walletTokens = await fetchWalletTokensAndFormat(tokensDB);
        dollarRef.current = ETH_TOKENS_DISPLAY;

        setEthTokens(walletTokens);
        console.log('walletTokens', walletTokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        isFetching.current = false; // Reset the flag after fetch completes
      }
    };

    if (ETH_TOKENS && Object.keys(ETH_TOKENS).length === 0) {
      fetchTokens();
    }

    if (ETH_TOKENS && Object.keys(ETH_TOKENS).length > 0) {
      setAllTokens(mergeTokens(chain_id, ETH_TOKENS));
    }
  }, [chain_id, ETH_TOKENS, account, authToken]);

  useEffect(() => {
    const setupProvider = async () => {
      if (walletProvider) {
        //    console.log('walletProvider', walletProvider);
        try {
          // Initialize ethers provider using the walletProvider
          const ethersProvider = new BrowserProvider(walletProvider);
          //     console.log('ethersProvider', ethersProvider);

          // Get the signer from the ethers provider
          const signer = await ethersProvider.getSigner();
          //       console.log('signer', signer);
          //       console.log('setting up provider and signer');
          // Set the provider and signer in state
          setSigner(signer);
          setProvider(ethersProvider);
        } catch (error) {
          console.error('Error setting up provider and signer:', error);
        }
      }
    };

    setupProvider(); // Call the async function
  }, [walletProvider, account, chain_id]);
  const encryptWalletAddress = (walletAddress, secret) => {
    return CryptoJS.AES.encrypt(walletAddress, secret).toString();
  };

  const dollarRef = useRef(ALL_TOKENS);

  const uniswapRouterAddress = CHAINS[chain_id].uniswapRouterAddressV2;
  const wethAddress = CHAINS[chain_id].wethAddress;
  const usdcAddress = CHAINS[chain_id].usdcAddress;

  const blockNumberRef = useRef(0);
  const ethDollarPrice = useRef('');

  const fetchNewBlockNumber = async () => {
    if (!account || !authToken) {
      console.log('!account || !authToken');
      return;
    }
    if (selectedNetworkId !== chain_id) {
      /*       console.log(
        '(selectedNetworkId !== chain_id)',
        selectedNetworkId !== chain_id
      ); */
    }
    let amounts = [];

    try {
      const blockNumber = await fetchBlockNumber(chain_id, authToken);
      //   console.log('blockNumber', blockNumber);

      if (blockNumberRef.current !== blockNumber) {
        blockNumberRef.current = blockNumber;
      }
      const amountIn = ethers.parseEther('1');

      const path = [wethAddress, usdcAddress];

      try {
        // Make the POST request to the backend API
        const response = await fetch('/api/rpc-call/get-amounts-out', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
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
          amounts = data.amounts; // Log the amounts array from the response
          console.log('Swap amounts:', data.amounts); // Log the amounts array from the response
        } else {
          //  console.error('Error:', data.error); // Handle error if any
        }
      } catch (error) {
        //   console.error('Error fetching swap amounts:', error); // Catch any fetch errors
      }

      await delay(100);
      let ethPriceInUsdc = amounts[1];
      let decimals = 6;
      if (chain_id === 56) {
        decimals = 18;
      }
      ethPriceInUsdc = ethers.formatUnits(ethPriceInUsdc, decimals);
      ethPriceInUsdc = Number(ethPriceInUsdc);
      ethPriceInUsdc = ethPriceInUsdc.toFixed(0);
      ethDollarPrice.current = ethPriceInUsdc;
    } catch (error) {
      console.error('Failed to fetch new block number:', error);
    }
  };
  useEffect(() => {
    let intervalId;

    fetchNewBlockNumber();

    const startPolling = () => {
      intervalId = setInterval(fetchNewBlockNumber, 30000);
    };

    const stopPolling = () => {
      clearInterval(intervalId);
    };

    startPolling();

    return () => {
      stopPolling();
    };
  }, [chain_id]);

  const savedPriorityGas = useRef(30);
  const savedSlippage = useRef(7);
  const savedInputAmount = useRef(undefined);
  const savedOutputAmount = useRef(undefined);
  const savedAddedPriority = useRef(undefined);
  const useAutoGas = useRef(true);
  const useAutoSlippage = useRef(false);

  function updateData(type, value) {
    if (type === 'savedSlippage') {
      savedSlippage.current = value;
      console.log('savedSlippage', value);
    } else if (type === 'priorityGas') {
      savedPriorityGas.current = value;
      console.log('savedPriorityGas', value);
    } else if (type === 'savedInputAmount') {
      savedInputAmount.current = Number(value);
      //     console.log('savedInputAmount', value);
    } else if (type === 'savedOutputAmount') {
      savedOutputAmount.current = value;
      //     console.log('savedOutputAmount', value);
    } else if (type === 'useAutoGas') {
      useAutoGas.current = value;
      console.log('useAutoGas', value);
    } else if (type === 'useAutoSlippage') {
      useAutoSlippage.current = value;
      console.log('useAutoSlippage', value);
    } else if (type === 'savedAddedPriority') {
      savedAddedPriority.current = value;
      console.log('savedAddedPriority', value);
    }
  }

  const tokenListOpenRef = useRef(false);

  useEffect(() => {
    if (!account || !ALL_TOKENS) return;

    async function updateDollarRef() {
      await fetchNewBlockNumber();
      const tokenPromises = Object.keys(ALL_TOKENS)
        .filter((key) => ALL_TOKENS[key].chain_id === chain_id)
        .map(async (key) => {
          const balanceData = await getDollarValue(ALL_TOKENS[key]);
          // return if banned symbol
          if (bannedSymbols.includes(ALL_TOKENS[key].symbol)) {
            return;
          }

          //   await delay(50);

          return {
            key,
            data: {
              dollarValue:
                Number(balanceData.dollarValue) < 1
                  ? ''
                  : balanceData.dollarValue,
              balance:
                Number(balanceData.dollarValue) < 1 ? '' : balanceData.balance,
              symbol: ALL_TOKENS[key].symbol,
              is_partner: ALL_TOKENS[key].is_partner,
              chain_id: ALL_TOKENS[key].chain_id,
              name: ALL_TOKENS[key].name,
              address: ALL_TOKENS[key].address,
              decimals: ALL_TOKENS[key].decimals,
              logo_uri: ALL_TOKENS[key].logo_uri,
            },
          };
        });

      const results = await Promise.all(tokenPromises);
      console.log('results', results);
      const updatedDollarRef = results.reduce((acc, {key, data}) => {
        acc[key] = data;
        return acc;
      }, {});

      dollarRef.current = updatedDollarRef;
      console.log('dollarRef updated');
    }

    updateDollarRef();
    function checkUpdateDollarRef() {
      if (tokenListOpenRef.current === false) {
        return;
      } else {
        updateDollarRef();
      }
    }

    const intervalId = setInterval(checkUpdateDollarRef, 12000);

    return () => clearInterval(intervalId);
  }, [account, chain_id, ALL_TOKENS]);

  async function getDollarValue(Token) {
    let ethPrice = '00.00';
    let isTokenList = true;
    let formattedBalance = '00.00';
    try {
      let oneEthInUSDC = ethDollarPrice.current;
      oneEthInUSDC = Number(oneEthInUSDC);

      if (Token.symbol === 'ETH' || Token.symbol === 'WETH') {
        if (isTokenList) {
          let balance;

          if (Token.symbol === 'WETH') {
            try {
              const response = await fetch('/api/rpc-call/get-weth-balance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
                },
                body: JSON.stringify({chain_id, account, wethAddress}),
              });

              const data = await response.json();
              if (response.ok) {
                //      console.log('WETH Balance:', data.balance);
                balance = data.balance; // Return the balance for display or further use
              } else {
                console.error('Error:', data.error);
              }
            } catch (error) {
              console.error('Failed to fetch WETH balance:', error);
            }
            if (balance === 0) {
              return;
            }
          } else if (Token.symbol === 'ETH') {
            try {
              const response = await fetch('/api/rpc-call/get-balance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
                },
                body: JSON.stringify({chain_id, account}),
              });

              const data = await response.json();
              if (response.ok) {
                //          console.log('Balance:', data.balance);
                balance = data.balance; // Return the balance for display or further use
              } else {
                console.error('Error:', data.error);
              }
            } catch (error) {
              console.error('Failed to fetch balance:', error);
            }
          }
          balance = ethers.formatEther(balance);
          balance = Number(balance);
          formattedBalance = balance.toFixed(4);
          let totalValue = balance * oneEthInUSDC;
          totalValue = totalValue.toFixed(2);
          ethPrice = totalValue;
        } else {
          let balance;
          if (isOutputToken) {
            balance = savedOutputAmount.current;
          } else {
            balance = savedInputAmount.current;
          }

          balance = Number(balance);
          balance = balance != null ? balance : 0;
          if (balance === 0) {
            ethPrice = '00.00';
            return;
          }
          let totalValue = balance * oneEthInUSDC;
          totalValue = totalValue.toFixed(2);
          ethPrice = totalValue;
        }
      } else {
        let tokenBalance;

        if (isTokenList) {
          const tokenAddress = Token.address;
          try {
            const response = await fetch('/api/rpc-call/get-token-balance', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
              },
              body: JSON.stringify({chain_id, account, tokenAddress}),
            });

            const data = await response.json();
            if (response.ok) {
              //     console.log('Token Balance:', data.tokenBalance);
              tokenBalance = data.tokenBalance; // Return the balance for display or further use
            } else {
              console.error('Error:', data.error);
            }
          } catch (error) {
            console.error('Failed to fetch token balance:', error);
          }
        } else {
          if (isOutputToken) {
            tokenBalance = savedOutputAmount.current;
          } else {
            tokenBalance = savedInputAmount.current;
          }
          tokenBalance = tokenBalance != null ? tokenBalance : 0;
          if (tokenBalance === 0n || tokenBalance == undefined) {
            return;
          }

          tokenBalance = String(tokenBalance);
          //    console.log(tokenBalance, 'Token Balance');

          tokenBalance = ethers.parseUnits(tokenBalance, Token.decimals);
          //   console.log(tokenBalance.toString(), 'Token Balance');
        }

        const path = [Token.address, wethAddress];
        if (
          tokenBalance === 0n ||
          tokenBalance == undefined ||
          tokenBalance == 0 ||
          tokenBalance == '0'
        ) {
          let balanceData = {
            balance: 0,
            dollarValue: 0,
          };

          return balanceData;
        }
        let amountOut = [];
        try {
          const response = await fetch('/api/rpc-call/get-amounts-out', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
            },
            body: JSON.stringify({
              chain_id, // Chain ID (e.g., Ethereum Mainnet = 1)
              amountIn: tokenBalance.toString(), // Convert BigInt to string before sending:
              path, // Path of token addresses
              uniswapRouterAddress, // Uniswap router address
            }),
          });

          const data = await response.json(); // Parse the response data

          if (response.ok) {
            amountOut = data.amounts;
          } else {
            throw new Error('Error fetching swap amounts:', data.error);
          }
        } catch (error) {
          //    console.error('Error fetching swap amounts:', error); // Catch any fetch errors
        }

        formattedBalance = ethers.formatUnits(tokenBalance, Token.decimals);
        formattedBalance = Number(formattedBalance).toFixed(3);
        let ethOut = amountOut[1];
        ethOut = ethers.formatEther(ethOut);
        ethOut = Number(ethOut);
        let totalDollarValue = ethOut * oneEthInUSDC;
        totalDollarValue = totalDollarValue.toFixed(2);
        ethPrice = totalDollarValue;
      }
    } catch (error) {
      //  console.error('Error getting token balance:', error);
      return (ethPrice = '00.00');
    }
    let balanceData = {
      balance: formattedBalance,
      dollarValue: ethPrice,
    };

    return balanceData;
  }

  const saverInputAmount = useRef(0);

  return (
    <BlockchainContext.Provider
      value={{
        AuthButton,
        authToken,
        saverInputAmount,
        chain_id,
        dollarRef,
        savedAddedPriority,
        useAutoGas,
        useAutoSlippage,
        blockNumberRef,
        ethDollarPrice,
        savedOutputAmount,
        savedInputAmount,
        savedSlippage,
        savedPriorityGas,
        updateData,
        provider,
        account,
        signer,
        tokenListOpenRef,
        ALL_TOKENS,
        ETH_TOKENS,
      }}>
      {children}
    </BlockchainContext.Provider>
  );
};

BlockchainProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
