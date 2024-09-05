import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import {ethers} from 'ethers';
// import {useAccount} from 'wagmi';

import ERC20ABI from './abis/erc20.json';
import uniswapRouterABI from './abis/UniswapRouter.json';
// import {useEthersProvider} from './provider';
import {useEthersSigner} from './signer';
import {erc20Abi} from 'viem';
import wethABI from './abis/wethABI.json';
// import {config} from '../config/config';
import mergeTokens from './mergeTokens';
import {watchChainId} from '@wagmi/core';
import {getChainId} from '@wagmi/core';
import {CHAINS} from './lib/constants';
// import {ETH_TOKENS} from './lib/constants';
import {BASE_TOKENS} from './lib/constants';
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from '@web3modal/ethers/react';
import {BrowserProvider, Contract, formatUnits} from 'ethers';

export const BlockchainContext = createContext({
  contractAddress: '',
  symbol: '',
  balance: 0,
  targetSymbol: '',
  tier: '',
});

export const BlockchainProvider = ({children}) => {
  // const provider = useEthersProvider();
  // const {address: account} = useAccount();
  //  const signer = useEthersSigner();
  const [chain_id, setChainId] = useState(/* getChainId(config) || */ 1);
  const [ETH_TOKENS, setEthTokens] = useState({});
  const [ALL_TOKENS, setAllTokens] = useState({});
  const {address: account, chainId, isConnected} = useWeb3ModalAccount();
  const {walletProvider} = useWeb3ModalProvider();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const providerRPC = CHAINS[chain_id].rpcUrl;

  const providerHTTP = new ethers.JsonRpcProvider(providerRPC);

  useEffect(() => {
    const setupProvider = async () => {
      if (walletProvider) {
        try {
          // Initialize ethers provider using the walletProvider
          const ethersProvider = new BrowserProvider(walletProvider);

          // Get the signer from the ethers provider
          const signer = await ethersProvider.getSigner();

          // Set the provider and signer in state
          setSigner(signer);
          setProvider(ethersProvider);
        } catch (error) {
          console.error('Error setting up provider and signer:', error);
        }
      }
    };

    setupProvider(); // Call the async function
  }, [walletProvider]);

  // const signer = await provider.getSigner()
  useEffect(() => {
    async function fetchTokens() {
      try {
        console.log('Fetching tokens...');
        const res = await fetch('/api/tokens');
        const data = await res.json();
        setEthTokens(data);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      }
    }
    if (ETH_TOKENS && Object.keys(ETH_TOKENS).length === 0) {
      fetchTokens();
    }
    if (ETH_TOKENS && Object.keys(ETH_TOKENS).length > 0) {
      setAllTokens(mergeTokens(chain_id, ETH_TOKENS));
    }
  }, [chain_id, ETH_TOKENS]);

  // console.log('ALL_TOKENS', ALL_TOKENS);

  const dollarRef = useRef(ALL_TOKENS);

  /*   useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(chain_id) {
        console.log('Chain ID changed!', chain_id);
        const currentUrl = window.location.href;
        if (currentUrl.includes('/base' || currentUrl.includes('/eth'))) {
          window.location.replace('https://PhenX.io/');
        }
        const newChainId = chain_id;
        setChainId(newChainId);
        console.log('newChainId', newChainId);
        if (newChainId === 1) {
          dollarRef.current = ETH_TOKENS;
        }
        if (newChainId === 8453) {
          dollarRef.current = BASE_TOKENS;
        }
      },
    });
    return () => {
      unwatch();
    };
  }, [config]); */

  const uniswapRouterAddress = CHAINS[chain_id].uniswapRouterAddressV2;
  const wethAddress = CHAINS[chain_id].wethAddress;
  const usdcAddress = CHAINS[chain_id].usdcAddress;

  const blockNumberRef = useRef(0);
  const ethDollarPrice = useRef('');

  useEffect(() => {
    let intervalId;

    const fetchNewBlockNumber = async () => {
      if (!provider) return;

      try {
        const blockNumber = await provider.getBlockNumber();
        //   console.log('blockNumber', blockNumber);

        if (blockNumberRef.current !== blockNumber) {
          blockNumberRef.current = blockNumber;
        }
        const amountIn = ethers.parseEther('1');

        const path = [wethAddress, usdcAddress];
        const routerContract = new ethers.Contract(
          uniswapRouterAddress,
          uniswapRouterABI,
          provider
        );

        const amounts = await routerContract.getAmountsOut(amountIn, path);
        let ethPriceInUsdc = amounts[1];
        ethPriceInUsdc = ethers.formatUnits(ethPriceInUsdc, 6);
        ethPriceInUsdc = Number(ethPriceInUsdc);
        ethPriceInUsdc = ethPriceInUsdc.toFixed(0);
        ethDollarPrice.current = ethPriceInUsdc;
      } catch (error) {
        console.error('Failed to fetch new block number:', error);
      }
    };

    const startPolling = () => {
      intervalId = setInterval(fetchNewBlockNumber, 12000);
    };

    const stopPolling = () => {
      clearInterval(intervalId);
    };

    startPolling();

    return () => {
      stopPolling();
    };
  }, [provider, chain_id]);

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
    if (!account) return;

    async function updateDollarRef() {
      const tokenPromises = Object.keys(ALL_TOKENS)
        .filter((key) => ALL_TOKENS[key].chain_id === chain_id)
        .map(async (key) => {
          const balanceData = await getDollarValue(ALL_TOKENS[key]);
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
        console.log('tokenListOpenRef is false');
        return;
      } else {
        updateDollarRef();
      }
    }

    const intervalId = setInterval(updateDollarRef, 12000);

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
              provider
            );
            balance = await wethContract.balanceOf(account);
            if (balance === 0) {
              return;
            }
          } else if (Token.symbol === 'ETH') {
            balance = await provider.getBalance(account);
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
        let token = new ethers.Contract(Token.address, erc20Abi, provider);

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
          provider
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

  return (
    <BlockchainContext.Provider
      value={{
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
