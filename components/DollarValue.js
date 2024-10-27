/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import {ethers} from 'ethers';
// import {useAccount} from 'wagmi';
// import {useEthersproviderHTTP} from './providerHTTP';
import {erc20Abi} from 'viem';
import {BlockchainContext} from './BlockchainContext';
import uniswapRouterABI from './abis/UniswapRouter.json';
import wethABI from './abis/wethABI.json';
import {CHAINS} from './lib/constants.js';
// import getQuoteV3 from './getQuoteV3';
import getTokenBalance from './rpc-calls/getTokenBalance';
import getAmountOutV2 from './rpc-calls/getAmountOutV2';
import getUniswapQuoteV3 from './rpc-calls/getUniswapQuoteV3';

function DollarValue({Token, isTokenList, isOutputToken}) {
  const {
    ethDollarPrice,
    savedInputAmount,
    savedOutputAmount,
    chain_id,
    account,
    saverInputAmount,
    authToken,
  } = useContext(BlockchainContext);
  const nativeSymbol = CHAINS[chain_id].nativeSymbol;

  const wethAddress = CHAINS[chain_id].wethAddress;
  const uniswapRouterAddress = CHAINS[chain_id].uniswapRouterAddressV2;

  const [ethPrice, setEthPrice] = useState('');
  const RATE_LIMIT = 500;
  const savedInputAmountRef = useRef(undefined);
  const savedOutputAmountRef = useRef(undefined);
  useEffect(() => {
    // setTimeout(changeTokenPrice, 2000);
    const handle = setInterval(() => {
      if (
        String(savedInputAmount.current) !==
          String(savedInputAmountRef.current) ||
        String(savedOutputAmount.current) !==
          String(savedOutputAmountRef.current)
      ) {
        console.log('changeTokenPrice');
        //     console.log(ethDollarPrice.current);
        //    console.log(ethPrice);
        changeTokenPrice();
        savedInputAmountRef.current = savedInputAmount.current;
        savedOutputAmountRef.current = savedOutputAmount.current;
      }
    }, RATE_LIMIT);
    return () => clearInterval(handle);
  }, [ethDollarPrice, account, ethPrice]);

  async function changeTokenPrice() {
    try {
      let oneEthInUSDC = ethDollarPrice.current;
      oneEthInUSDC = Number(oneEthInUSDC);

      if (Token.symbol === nativeSymbol || Token.symbol === 'WETH') {
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
                console.log('WETH Balance:', data.balance);
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
          } else if (Token.symbol === nativeSymbol) {
            try {
              const response = await fetch('/api/rpc-call/get-balance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({chain_id, account}),
              });

              const data = await response.json();
              if (response.ok) {
                console.log('Balance:', data.balance);
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
          let totalValue = balance * oneEthInUSDC;
          totalValue = totalValue.toFixed(2);

          setEthPrice(totalValue);
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
            setEthPrice('0');
            return;
          }
          let totalValue = balance * oneEthInUSDC;
          totalValue = totalValue.toFixed(2);
          if (!isOutputToken) {
            console.log(totalValue, 'totalValue');
            saverInputAmount.current = totalValue;
          }
          setEthPrice(totalValue);
        }
      } else {
        let tokenBalance;

        if (isTokenList) {
          tokenBalance = await getTokenBalance(
            chain_id,
            account,
            Token.address,
            authToken
          );
        } else {
          if (isOutputToken) {
            tokenBalance = savedOutputAmount.current;
          } else {
            tokenBalance = savedInputAmount.current;
          }
          tokenBalance = tokenBalance != null ? tokenBalance : 0;

          tokenBalance = String(tokenBalance);
          //    console.log(tokenBalance, 'Token Balance');

          tokenBalance = ethers.parseUnits(tokenBalance, Token.decimals);
          //    console.log(tokenBalance.toString(), 'Token Balance');
        }

        const path = [Token.address, wethAddress];

        let amountOut;
        let amountOutV3;
        try {
          // amountOut = await routerContract.getAmountsOut(tokenBalance, path);
          amountOut = await getAmountOutV2(
            chain_id,
            tokenBalance,
            path,
            uniswapRouterAddress,
            authToken
          );
        } catch (error) {}
        try {
          /*           amountOutV3 = await getQuoteV3(
            path[0],
            path[1],
            tokenBalance,
            chain_id
          ); */
          amountOutV3 = await getUniswapQuoteV3(
            path[0],
            path[1],
            tokenBalance,
            chain_id,
            authToken
          );
        } catch (error) {}

        let ethOut;
        if (amountOut && amountOut[1] > amountOutV3) {
          ethOut = amountOut[1];
        } else {
          ethOut = amountOutV3.amountOut;
        }
        //  const toLowerCaseTokenSymbol = Token.symbol.toLowerCase();
        /*         if (ETH_TOKENS[toLowerCaseTokenSymbol]?.useV2 === true) {
          ethOut = amountOut[1];
        } */
        console.log(ethOut, 'ethOutethOutethOutethOut');
        ethOut = ethers.formatEther(ethOut);
        ethOut = Number(ethOut);
        let totalDollarValue = ethOut * oneEthInUSDC;

        totalDollarValue = totalDollarValue.toFixed(2);
        if (!isOutputToken) {
          console.log(totalDollarValue, 'totalDollarValue');
          saverInputAmount.current = totalDollarValue;
        }
        setEthPrice(totalDollarValue);
      }
    } catch (error) {
      //    console.error('Error getting token balance:', error);
      return setEthPrice('0.00');
    }
  }

  if (
    ethPrice === '0' ||
    ethPrice === '0.00' ||
    ethPrice === 0 ||
    ethPrice === ''
  ) {
    return <div className='dollar-value'>-</div>;
  } else return <div className='dollar-value'>${ethPrice}</div>;
}

export default DollarValue;
