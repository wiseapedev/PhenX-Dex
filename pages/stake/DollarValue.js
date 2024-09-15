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
import {StakeContext} from '../../stake-page/StakeContext';
import uniswapRouterABI from './abis/UniswapRouter.json';
const CHAINS = {
  1: {
    name: 'Ethereum',
    chainId: 1,
    usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    uniswapRouterAddressV2: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    uniswapFactoryAddressV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    uniswapRouterAddressV3: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    uniswapQuoterV3: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
    udxRouterAddress: '0x2fa82206863aA969563E1dD7F153304f40C5000D',
    phenxTokenAddress: '0xd166b7D9824cc5359360B47389AbA9341cE12619',
    rpcUrl: process.env.NEXT_PUBLIC_ETH_RPC,
  },
};
function DollarValue({tokenAmount}) {
  const {provider} = useContext(StakeContext);
  const [ethPrice, setEthPrice] = useState('00.00');

  async function getEthDollarPrice() {
    try {
      const amountIn = ethers.parseEther('1');

      const path = [CHAINS[1].wethAddress, CHAINS[1].usdcAddress];
      const routerContract = new ethers.Contract(
        CHAINS[1].uniswapRouterAddressV2,
        uniswapRouterABI,
        provider
      );

      const amounts = await routerContract.getAmountsOut(amountIn, path);
      let ethPriceInUsdc = amounts[1];
      ethPriceInUsdc = ethers.formatUnits(ethPriceInUsdc, 6);
      ethPriceInUsdc = Number(ethPriceInUsdc);
      ethPriceInUsdc = ethPriceInUsdc.toFixed(0);
      console.log(ethPriceInUsdc, 'ETH Price in USDC');
      return ethPriceInUsdc;
    } catch (error) {
      console.error('', error);
    }
  }

  async function getDollarValue() {
    try {
      if (!tokenAmount) {
        return;
      }
      const ethDollarPrice = await getEthDollarPrice();
      const Token = CHAINS[1].phenxTokenAddress;
      const wethAddress = CHAINS[1].wethAddress;
      const uniswapRouterAddress = CHAINS[1].uniswapRouterAddressV2;

      let tokenBalance = tokenAmount;

      tokenBalance = String(tokenBalance);
      tokenBalance = ethers.parseUnits(tokenBalance, 9);

      console.log(tokenBalance, 'Token Balance');
      let ethPrice = '00.00';
      let formattedBalance = '00.00';
      let oneEthInUSDC = ethDollarPrice;
      oneEthInUSDC = Number(oneEthInUSDC);

      const path = [Token, wethAddress];
      const routerContract = new ethers.Contract(
        uniswapRouterAddress,
        uniswapRouterABI,
        provider
      );
      let amountOut;
      amountOut = await routerContract.getAmountsOut(tokenBalance, path);
      formattedBalance = ethers.formatUnits(String(tokenBalance), 9);
      formattedBalance = Number(formattedBalance).toFixed(3);
      let ethOut = amountOut[1];
      ethOut = ethers.formatEther(ethOut);
      ethOut = Number(ethOut);
      let totalDollarValue = ethOut * oneEthInUSDC;
      console.log(totalDollarValue, 'Total Dollar Value');
      totalDollarValue = totalDollarValue.toFixed(4);
      ethPrice = totalDollarValue;
      setEthPrice(ethPrice);

      console.log(ethPrice, 'ETH Price');
    } catch (error) {
      console.error('Error getting token balance:', error);
      return;
    }
  }

  useEffect(() => {
    getDollarValue();
  }, []);

  return <div className='dollar-value'>${ethPrice}</div>;
}

export default DollarValue;
