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

import {useWeb3Modal} from '@web3modal/ethers/react';

import {BrowserProvider, Contract, formatUnits} from 'ethers';
import Bottleneck from 'bottleneck';

export const BlockchainContext = createContext({
  contractAddress: '',
  symbol: '',
  balance: 0,
  targetSymbol: '',
  tier: '',
});
import delay from './delay';

export const BlockchainProvider = ({children}) => {
  // const provider = useEthersProvider();
  // const {address: account} = useAccount();
  //  const signer = useEthersSigner();
  // const {open, selectedNetworkId} = useAppKitState();
  const limiter = useRef(
    new Bottleneck({
      maxConcurrent: 1, // Only allow 1 concurrent request
      minTime: 1000, // At least 200ms between requests
    })
  );
  const limit = (task) => limiter.current.schedule(task);

  const [ETH_TOKENS, setEthTokens] = useState({});
  const [ALL_TOKENS, setAllTokens] = useState({});
  const {address: account, chainId} = useWeb3ModalAccount();
  const [chain_id, setChainId] = useState(1);

  const selectedNetworkId = useMemo(() => chainId, [chainId]);
  const {walletProvider} = useWeb3ModalProvider();
  // const {walletProvider} = useAppKitProvider();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const providerRPC = CHAINS[chain_id].rpcUrl;

  const providerHTTP = new ethers.JsonRpcProvider(providerRPC);

  useEffect(() => {
    if (selectedNetworkId) {
      //   if (selectedNetworkId === 'eip155:8453') {
      if (selectedNetworkId === 8453) {
        setChainId(8453);
        //   } else if (selectedNetworkId === 'eip155:1') {
      } else if (selectedNetworkId === 1) {
        setChainId(1);
      }
      console.log('selectedNetworkId', selectedNetworkId);
    }
  }, [selectedNetworkId]);

  // fetch and format user tokens in wallet api call
  /*   const fetchTokens = async () => {
      try {
        const QUICKNODE_RPC_URL = 'https://your-unique-name.quiknode.pro/your-api-key/';
        const walletAddress = '0xYourWalletAddress';

        // Setup the JSON-RPC data for the request
        const data = {
          id: 1,
          jsonrpc: '2.0',
          method: 'qn_getWalletTokenBalance',
          params: {
            address: walletAddress,
            perPage: 100,
            page: 1,
          },
        };

        // Make the request using Axios
        const response = await axios.post(QUICKNODE_RPC_URL, data);
        const tokenData = response.data.result;

        // Format token data if needed and merge with base tokens
        setEthTokens(tokenData);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      }
    }; */

  const fetchWalletTokensAndFormat = async (tokensDB) => {
    const tokensDbLength = Object.keys(tokensDB).length;

    try {
      const response = await fetch('/api/get-user-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const bannedSymbols = ['USD0 [www.usual.finance]'];

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

  useEffect(() => {
    if (!account) return;
    // Define the asynchronous function inside useEffect
    const fetchTokens = async () => {
      try {
        const res = await fetch('/api/tokens');
        const tokensDB = await res.json();
        const walletTokens = await fetchWalletTokensAndFormat(tokensDB);
        setEthTokens(walletTokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      }
    };

    if (ETH_TOKENS && Object.keys(ETH_TOKENS).length === 0) {
      fetchTokens();
    }

    if (ETH_TOKENS && Object.keys(ETH_TOKENS).length > 0) {
      setAllTokens(mergeTokens(chain_id, ETH_TOKENS));
    }
  }, [chain_id, ETH_TOKENS, account]);

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

  // const signer = await provider.getSigner()

  // console.log('ALL_TOKENS', ALL_TOKENS);

  const dollarRef = useRef(ALL_TOKENS);

  const uniswapRouterAddress = CHAINS[chain_id].uniswapRouterAddressV2;
  const wethAddress = CHAINS[chain_id].wethAddress;
  const usdcAddress = CHAINS[chain_id].usdcAddress;

  const blockNumberRef = useRef(0);
  const ethDollarPrice = useRef('');

  const fetchNewBlockNumber = async () => {
    if (!providerHTTP) return;
    if (selectedNetworkId !== chain_id) {
      console.log(
        '(selectedNetworkId !== chain_id)',
        selectedNetworkId !== chain_id
      );
    }

    try {
      const blockNumber = await providerHTTP.getBlockNumber();
      //   console.log('blockNumber', blockNumber);

      if (blockNumberRef.current !== blockNumber) {
        blockNumberRef.current = blockNumber;
      }
      const amountIn = ethers.parseEther('1');

      const path = [wethAddress, usdcAddress];
      const routerContract = new ethers.Contract(
        uniswapRouterAddress,
        uniswapRouterABI,
        providerHTTP
      );

      const amounts = await routerContract.getAmountsOut(amountIn, path);
      await delay();
      let ethPriceInUsdc = amounts[1];
      ethPriceInUsdc = ethers.formatUnits(ethPriceInUsdc, 6);
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
  }, [providerHTTP, chain_id]);

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
          await delay();
          return {
            key,
            data: {
              dollarValue: balanceData.dollarValue || '',
              balance: balanceData.balance || '',
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
            const wethContract = new ethers.Contract(
              wethAddress,
              wethABI,
              providerHTTP
            );
            balance = await wethContract.balanceOf(account);
            if (balance === 0) {
              return;
            }
          } else if (Token.symbol === 'ETH') {
            balance = await providerHTTP.getBalance(account);
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
        let token = new ethers.Contract(Token.address, erc20Abi, providerHTTP);

        let tokenBalance;

        if (isTokenList) {
          tokenBalance = await token.balanceOf(account);
        } else {
          if (isOutputToken) {
            tokenBalance = savedOutputAmount.current;
          } else {
            tokenBalance = savedInputAmount.current;
          }
          tokenBalance = tokenBalance != null ? tokenBalance : 0;
          if (tokenBalance === 0n) {
            return;
          }

          tokenBalance = String(tokenBalance);
          //    console.log(tokenBalance, 'Token Balance');

          tokenBalance = ethers.parseUnits(tokenBalance, Token.decimals);
          //    console.log(tokenBalance.toString(), 'Token Balance');
        }

        const path = [Token.address, wethAddress];
        const routerContract = new ethers.Contract(
          uniswapRouterAddress,
          uniswapRouterABI,
          providerHTTP
        );
        let amountOut;
        amountOut = await routerContract.getAmountsOut(tokenBalance, path);
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
        limit,
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
        providerHTTP,
      }}>
      {children}
    </BlockchainContext.Provider>
  );
};

BlockchainProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
