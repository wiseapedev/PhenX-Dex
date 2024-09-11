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
import getQuoteV3 from './getQuoteV3';
import {ETH_TOKENS} from './lib/constants.js';

function DollarValue({Token, isTokenList, isOutputToken}) {
  const {
    ethDollarPrice,
    savedInputAmount,
    savedOutputAmount,
    chain_id,
    providerHTTP,
    account,
  } = useContext(BlockchainContext);

  const wethAddress = CHAINS[chain_id].wethAddress;
  const uniswapRouterAddress = CHAINS[chain_id].uniswapRouterAddressV2;
  // const providerHTTP = useEthersproviderHTTP();

  const [ethPrice, setEthPrice] = useState('0');
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
  }, [ethDollarPrice, providerHTTP, account, ethPrice]);

  async function changeTokenPrice() {
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
          setEthPrice(totalValue);
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
        let amountOutV3;
        try {
          amountOut = await routerContract.getAmountsOut(tokenBalance, path);
        } catch (error) {}
        try {
          amountOutV3 = await getQuoteV3(
            path[0],
            path[1],
            tokenBalance,
            chain_id
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
        console.log(totalDollarValue, 'totalDollarValue');
        totalDollarValue = totalDollarValue.toFixed(2);
        setEthPrice(totalDollarValue);
      }
    } catch (error) {
      console.error('Error getting token balance:', error);
      return setEthPrice('0.00');
    }
  }

  return <div className='dollar-value'>${ethPrice}</div>;
}

export default DollarValue;
