/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* use client */
import {
  Settings,
  Medium,
  Telegram,
  Twitter,
  YouTube,
  Refresh,
  SaverInfoIcon,
  DownArrow,
} from './SVGMAIN.js';
import SwapSettings from './SwapSettings';
import {useState, useEffect, useContext, useRef, useMemo, use} from 'react';
import {ethers} from 'ethers';
import BigNumber from 'bignumber.js';
import {BlockchainContext} from './BlockchainContext';
import qs from 'qs';
import {erc20Abi} from 'viem';
import TokenList from './TokenList';
import {toast} from 'react-toastify';
import Audit from './z-custom/audit';
import OpenBeta from './z-custom/OpenBeta';
import BannerAd from './z-custom/BannerAd';
import BannerAd2 from './z-custom/BannerAd2';

import Iframe from './z-custom/Iframe';
import BackToTopButton from './BackToTopButton';
import routerABI from './abis/router.json';
import wethABI from './abis/wethABI.json';
import DollarValue from './DollarValue';
import uniswapRouterABI from './abis/UniswapRouter.json';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import getQuoteV3 from '../components/getQuoteV3';
import uniswapRouterV3ABI from '../components/abis/uniswapRouterV3.json';
import uniswapRouterV2ABI from '../components/abis/uniswapRouterV2.json';
import uniswapFactoryV2ABI from '../components/abis/uniswapFactoryV2.json';
import pairV2ABI from '../components/abis/pairV2.json';
import LiveCoinWatch from './LiveCoinWatch';
import IconLinks from './IconLinks';
import WalletIcon from './svgs/WalletIcon';
import mergeTokens from './mergeTokens';
import {watchChainId} from '@wagmi/core';
import {getChainId} from '@wagmi/core';
import {CHAINS} from './lib/constants.js';
import {sign} from 'crypto';
import PromoToken from './PromoToken';
import Portfolio from './Portfolio';
import BlockTimer from './BlockTimer';
import ContractLinks from './ContractLinks';
import Switch from './Switch';

const Swap = ({buyLink, buyLinkKey, chainId}) => {
  const {signer, provider, account, tokenListOpenRef} =
    useContext(BlockchainContext);
  const feeAddress = '0x1c2061fACa9DF7B6c02e7EB8dEBed1f37B24C6A9';
  const uniswapRouterAddress = CHAINS[chainId].uniswapRouterAddressV2;
  const routerAddressV3 = CHAINS[chainId].uniswapRouterAddressV3;
  const routerAddress = CHAINS[chainId].udxRouterAddress;
  const wethAddress = CHAINS[chainId].wethAddress;
  const uniswapFactoryV2Address = CHAINS[chainId].uniswapFactoryV2Address;
  let weth = wethAddress;

  const ALL_TOKENS = mergeTokens(chainId);
  /*   useEffect(() => {
    if (buyLink) {
      handleContractImport(buyLink);
    }
  }, [buyLink]);
 */
  function balanceDisplayFixer(balance) {
    if (balance === '0') {
      return '0';
    } else {
      return parseFloat(balance).toFixed(2);
    }
  }
  function disableSwapContainer() {
    try {
      const swapContainer = document.querySelector('.swap-container');
      if (swapContainer) {
        swapContainer.classList.add('disable');
      } else {
        throw new Error('Swap container not found');
      }
    } catch (error) {
      //   console.error('Error disabling swap container:', error);
      // Handle the error as appropriate for your application
    }
  }

  function enableSwapContainer() {
    try {
      const swapContainer = document.querySelector('.swap-container');
      if (swapContainer) {
        swapContainer.classList.remove('disable');
      } else {
        throw new Error('Swap container not found');
      }
    } catch (error) {
      //   console.error('Error enabling swap container:', error);
      // Handle the error as appropriate for your application
    }
  }
  function getBuyToken() {
    if (!buyLink) {
      return Object.keys(ALL_TOKENS)[3];
      //  return 'udx';
    } else {
      return buyLinkKey;
    }
  }

  const [priortyGas, setPriorityGas] = useState(0.1);
  const [slippage, setSlippage] = useState(1);
  const priorityGasRef = useRef(null);
  const slippageRef = useRef(null);
  const [buyToken, setBuyToken] = useState(getBuyToken());

  const [showChart, setShowChart] = useState(false);
  const [showAudits, setShowAudits] = useState(false);

  const [sellToken, setSellToken] = useState('eth');
  const [sellTokenDisplayBalance, setSellTokenDisplayBalance] = useState(0);
  const [buyTokenDisplayBalance, setBuyTokenDisplayBalance] = useState(0);
  const [showTokenList, setShowTokenList] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const GWEI = useRef(0);
  const RATE_LIMIT = 1500;
  useEffect(() => {
    tokenListOpenRef.current = showTokenList;
  }, [showTokenList]);

  function setShowChartState(value) {
    setShowChart(value);
  }
  function setShowAuditsState(value) {
    setShowAudits(value);
  }
  function swapTokens() {
    const buyTokenSave = buyToken;
    const sellTokenSave = sellToken;
    setBuyToken(sellTokenSave);
    setSellToken(buyTokenSave);
  }
  /*   useEffect(() => {
    disableSwapContainer();
    const timeout = setTimeout(() => {
      enableSwapContainer();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [buyToken, sellToken]); */

  function CurrentGwei() {
    const [CurrentGwei, setCurrentGwei] = useState(GWEI.current);

    async function getGasFees() {
      try {
        const feeData = await provider.getFeeData();
        //   console.log('feeData', feeData);
        const baseFeePerGas = feeData.gasPrice;
        //    console.log('baseFeePerGas', baseFeePerGas);

        const baseFeePerGasGwei = ethers.formatUnits(
          baseFeePerGas?.toString(),
          'gwei'
        );
        //    console.log('baseFeePerGasGwei', baseFeePerGasGwei);
        if (baseFeePerGasGwei !== GWEI.current) {
          GWEI.current = Number(baseFeePerGasGwei).toFixed(2);
          //   console.log('GWEI.current', GWEI.current);
          let currentFee = Number(baseFeePerGasGwei).toFixed(2);
          if (currentFee > 50) {
            currentFee = `${GWEI.current} High 🔴`;
          } else if (currentFee > 30) {
            currentFee = `${GWEI.current} High 🟠`;
          } else if (currentFee > 20) {
            currentFee = `${GWEI.current} Average 🟡`;
          } else {
            currentFee = `${GWEI.current} Low 🟢`;
          }

          setCurrentGwei(currentFee);
        }
      } catch (error) {}
    }

    useEffect(() => {
      const interval = setInterval(() => {
        getGasFees();
      }, 3000);

      return () => clearInterval(interval);
    }, []);
    return CurrentGwei;
  }

  useEffect(() => {
    async function updateTokenBalances() {
      if (account && sellToken && buyToken) {
        const sellTokenBalance = await getTokenBalance(sellToken);
        const buyTokenBalance = await getTokenBalance(buyToken);

        setSellTokenDisplayBalance(sellTokenBalance);
        setBuyTokenDisplayBalance(buyTokenBalance);
      }
    }

    updateTokenBalances();
  }, [account, sellToken, buyToken, trigger]);

  async function getTokenBalance(tokenKey) {
    try {
      if (account && tokenKey) {
        const token = ALL_TOKENS[tokenKey];
        const tokenContract = new ethers.Contract(
          token.address,
          erc20Abi,
          provider
        );
        let balance;
        if (tokenKey === 'eth') {
          balance = await provider.getBalance(account);
        } else {
          balance = await tokenContract.balanceOf(account);
        }

        balance = ethers.formatUnits(balance, token.decimals);
        balance = Number(balance);

        return balance;
      } else {
        return '0';
      }
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 'Error'; // Or handle the error as appropriate for your application
    }
  }

  function handlePriorityGasChange(value) {
    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    }
    setPriorityGas(value);
    priorityGasRef.current.value = value;
  }
  function handleSlippageChange(value) {
    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    }
    setSlippage(value);
    slippageRef.current.value = value;
  }
  const handleShowTokenList = (type) => {
    setShowTokenList(type);
  };
  const handleSellTokenChange = (key, isPort) => {
    setSellToken(key);
    if (isPort === true) {
      setBuyToken('eth');
      setMainTab('Swap');
      setSubTab('Trade');
    }
  };
  const handleBuyTokenChange = (key, isPort) => {
    setBuyToken(key);
    if (isPort === true) {
      setSellToken('eth');
      setMainTab('Swap');
      setSubTab('Trade');
    }
  };

  function YouPay({setShowTokenList, ALL_TOKENS, sellTokenDisplayBalance}) {
    disableSwapContainer();
    const {updateData} = useContext(BlockchainContext);
    updateData('savedInputAmount', 0);

    const inputRef = useRef(null);
    function handleInputAmountChange(value) {
      console.log('handleInputAmountChange', value);
      updateData('savedInputAmount', value);
    }
    function handleMax() {
      inputRef.current.value = sellTokenDisplayBalance;
      updateData('savedInputAmount', sellTokenDisplayBalance);
    }

    enableSwapContainer();

    return (
      <div className='flex-col'>
        <div className='token-input-box'>
          <div className='flex-row'>
            <div className='small-text'>Sell</div>
            <div className='small-text'></div>
          </div>
          <div className='flex-row'>
            <input
              className='token-input'
              placeholder='0'
              type='number'
              ref={inputRef}
              onChange={(e) => handleInputAmountChange(e.target.value)}
            />
            <div
              className='token-select-box'
              onClick={() => setShowTokenList('sellToken')}>
              <img
                src={ALL_TOKENS[sellToken].logoURI}
                alt={ALL_TOKENS[sellToken].name}
                width={25}
                height={25}
                style={{borderRadius: '50%'}}
              />{' '}
              <div className='med-text'>{ALL_TOKENS[sellToken].symbol}</div>
              <DownArrow />{' '}
            </div>
          </div>
          <div className='flex-row'>
            <div className='small-text'>
              {' '}
              <DollarValue Token={ALL_TOKENS[sellToken]} />
            </div>
            <div className='small-text'>
              <div className='max-row'>
                <div className='max-button' onClick={handleMax}>
                  MAX
                </div>
                <WalletIcon />
                {balanceDisplayFixer(sellTokenDisplayBalance)}{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function YouReceive({setShowTokenList, ALL_TOKENS, buyTokenDisplayBalance}) {
    const {savedOutputAmount, savedInputAmount} = useContext(BlockchainContext);
    const [outputAmount, setOutputAmount] = useState(savedOutputAmount.current);
    useEffect(() => {
      const handle = setInterval(() => {
        if (Number(savedOutputAmount.current) !== Number(outputAmount)) {
          console.log('savedOutputAmount', savedOutputAmount.current);

          if (Number(savedInputAmount.current) > 0) {
            setOutputAmount(savedOutputAmount.current);
          } else {
            setOutputAmount('');
          }
        }
        if (
          Number(savedInputAmount.current) === 0 ||
          savedInputAmount.current == '0' ||
          savedInputAmount.current == ''
        ) {
          savedOutputAmount.current = '0';
          if (outputAmount !== '') {
            console.log(
              ' Number(savedInputAmount.current) === 0',
              savedInputAmount.current
            );
            setOutputAmount('');
          }
        }
      }, 1000);

      return () => clearInterval(handle);
    }, [savedOutputAmount, outputAmount]);

    const [newListing, setNewListing] = useState(false);

    useEffect(() => {
      if (Object.keys(ALL_TOKENS)[3] === buyToken) {
        setNewListing(true);
      } else {
        setNewListing(false);
      }
    }, [buyToken]);

    return (
      <div className='flex-col'>
        <div className='token-input-box'>
          <div className='flex-row'>
            <div className='small-text'>Buy</div>
            <div className='small-text'></div>
          </div>
          <div className='flex-row'>
            <input
              className='token-input'
              placeholder={savedOutputAmount.current}
              type='number'
              readOnly
            />
            <div
              className='token-select-box'
              onClick={() => setShowTokenList('buyToken')}>
              {newListing && <div className='new-listing'>NEW</div>}
              <img
                src={ALL_TOKENS[buyToken].logoURI}
                alt={ALL_TOKENS[buyToken].name}
                width={25}
                height={25}
                style={{borderRadius: '50%'}}
              />{' '}
              <div className='med-text'>{ALL_TOKENS[buyToken].symbol}</div>
              <DownArrow />
            </div>
          </div>
          <div className='flex-row'>
            <div className='small-text'>
              {outputAmount > 0 ? (
                <DollarValue
                  Token={ALL_TOKENS[buyToken]}
                  isOutputToken={true}
                />
              ) : (
                '$0'
              )}
            </div>

            <div className='small-text'>
              <div className='max-row'>
                <WalletIcon />
                {balanceDisplayFixer(buyTokenDisplayBalance)}{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function QuoteView() {
    console.log('➡️➡️➡️ QuoteView State Change');
    const {
      account,
      savedInputAmount,
      updateData,
      signer,
      provider,
      savedSlippage,
      savedPriorityGas,
      savedOutputAmount,
      useAutoGas,
      useAutoSlippage,
      savedAddedPriority,
    } = useContext(BlockchainContext);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sellAmount, setSellAmount] = useState(0);
    const [buyAmount, setBuyAmount] = useState('');
    const [slippage, setSlippage] = useState(
      Number(savedSlippage.current) / 100
    );
    const gasLevelRef = useRef(null);
    const [swapData, setSwapData] = useState({});

    useEffect(() => {
      const handle = setInterval(() => {
        const inputAmount = Number(savedInputAmount.current);
        const OutputAmount = Number(savedOutputAmount.current);
        const Slippage = String(savedSlippage.current);
        const PriorityGas = String(savedPriorityGas.current);

        if (String(savedInputAmount.current) !== String(sellAmount)) {
          console.log('✅ inputAmount amount', inputAmount);
          console.log(
            '✅ savedInputAmount.current amount',
            savedInputAmount.current
          );
          setSellAmount(String(savedInputAmount.current));
          return;
        }

        if (Number(Slippage) / 100 !== Number(slippage)) {
          setSlippage(Number(Slippage) / 100);
          console.log('new slippage', Slippage);
          return;
        }
        if (PriorityGas !== gasLevelRef.current) {
          console.log('new gas', PriorityGas);
          console.log('gasLevel', gasLevelRef.current);
          gasLevelRef.current = PriorityGas;
          return;
        }
      }, RATE_LIMIT);
      return () => clearInterval(handle);
    }, [sellAmount, slippage]);

    useEffect(() => {
      if (sellAmount > 0 && sellToken && buyToken) {
        console.log('✅ fetchPrice');
        fetchPrice();
      }
    }, [sellAmount, sellToken, buyToken]);

    const blockNumberRef = useRef(0);
    useEffect(() => {
      let intervalId;

      const fetchNewBlockNumber = async () => {
        if (!provider) return;

        try {
          const blockNumber = await provider.getBlockNumber();

          if (blockNumberRef.current !== blockNumber) {
            if (chainId !== 1) {
              const isMoreThan3 = blockNumber > blockNumberRef.current + 3;
              if (!isMoreThan3) {
                return;
              }
            }
            blockNumberRef.current = blockNumber;
            if (sellAmount > 0 && sellToken && buyToken) {
              //   fetchPrice();
            }
          }
        } catch (error) {
          console.error('Failed to fetch new block number:', error);
        }
      };

      const startPolling = () => {
        intervalId = setInterval(fetchNewBlockNumber, 500);
      };

      const stopPolling = () => {
        clearInterval(intervalId);
      };

      startPolling();

      return () => {
        stopPolling();
      };
    }, []);

    async function fetchPrice() {
      if (
        !ALL_TOKENS[sellToken] ||
        !ALL_TOKENS[buyToken] ||
        !account ||
        !sellAmount
      ) {
        return <div className='swap-button disable'>......</div>;
      }

      try {
        const sellTokenDecimals = ALL_TOKENS[sellToken]?.decimals;
        let parsedSellAmount = ethers.parseUnits(sellAmount, sellTokenDecimals);
        console.log('➡️➡️ parsedSellAmount', parsedSellAmount);

        async function getPriceData() {
          try {
            const routerContract = new ethers.Contract(
              uniswapRouterAddress,
              uniswapRouterABI,
              provider
            );

            const defineSwapType = () => {
              const buyTokenSymbol = ALL_TOKENS[buyToken].symbol;
              const sellTokenSymbol = ALL_TOKENS[sellToken].symbol;
              if (sellTokenSymbol === 'ETH' && buyTokenSymbol !== 'ETH') {
                return 'ETH/TOKEN';
              } else if (
                sellTokenSymbol !== 'ETH' &&
                buyTokenSymbol === 'ETH'
              ) {
                return 'TOKEN/ETH';
              } else {
                return 'TOKEN/TOKEN';
              }
            };

            const getEthToTokenBestQuote = async () => {
              let v2Quote = null;
              let v3Quote = null;

              // Try to fetch Uniswap V2 quote
              try {
                const amountsOutV2 = await routerContract.getAmountsOut(
                  parsedSellAmount,
                  [wethAddress, ALL_TOKENS[buyToken].address]
                );
                v2Quote = amountsOutV2[1]; // Assuming the result is in the second position
                console.log('V2 Quote:', v2Quote);
              } catch (error) {
                console.error('Fetching V2 quote failed:', error);
                // Optionally handle specific actions if V2 fails, e.g., logging or fallback strategies
              }

              // Try to fetch Uniswap V3 quote
              try {
                v3Quote = await getQuoteV3(
                  wethAddress,
                  ALL_TOKENS[buyToken].address,
                  parsedSellAmount,
                  chainId
                );
                console.log('V3 Quote:', v3Quote);
              } catch (error) {
                console.error('Fetching V3 quote failed:', error);
                // Optionally handle specific actions if V3 fails, e.g., logging or fallback strategies
              }

              // Decide which quote to return based on availability and size
              if (v2Quote && v3Quote) {
                return v2Quote > v3Quote
                  ? {bestQuote: v2Quote, isV3Only: false}
                  : {
                      bestQuote: v3Quote.amountOut,
                      fee: v3Quote.fee,
                      isV3Only: true,
                    };
              } else if (v2Quote) {
                return {bestQuote: v2Quote, isV3Only: false, isV2Only: true};
              } else if (v3Quote) {
                return {
                  bestQuote: v3Quote.amountOut,
                  isV3Only: true,
                  isV2Only: false,
                  fee: v3Quote.fee,
                };
              } else {
                // Handle the case where neither quote is available
                console.error('No quotes available for ETH to Token swap.');
                return null; // Indicate failure to fetch any quotes
              }
            };
            const getTokenToEthBestQuote = async () => {
              let v2Quote = null;
              let v3Quote = null;

              // Attempt to fetch the Uniswap V2 quote
              try {
                const amountsOutV2 = await routerContract.getAmountsOut(
                  parsedSellAmount,
                  [ALL_TOKENS[sellToken].address, wethAddress]
                );
                v2Quote = amountsOutV2[1]; // Assuming the result is the output amount of interest
                console.log('V2 Quote:', v2Quote);
              } catch (error) {
                console.error('Fetching V2 quote failed:', error);
                // Optionally, handle the failure, e.g., by logging, retrying, or falling back to another method
              }

              // Attempt to fetch the Uniswap V3 quote
              try {
                v3Quote = await getQuoteV3(
                  ALL_TOKENS[sellToken].address,
                  wethAddress,
                  parsedSellAmount,
                  chainId
                );
                console.log('V3 Quote:', v3Quote);
              } catch (error) {
                console.error('Fetching V3 quote failed:', error);
                // Similarly, handle this failure appropriately
              }

              if (v2Quote && v3Quote) {
                return v2Quote > v3Quote
                  ? {bestQuote: v2Quote, isV3Only: false, isV2Only: true}
                  : {
                      bestQuote: v3Quote.amountOut,
                      isV3Only: true,
                      isV2Only: false,
                      fee: v3Quote.fee,
                    };
              } else if (v2Quote) {
                return {bestQuote: v2Quote, isV3Only: false, isV2Only: true};
              } else if (v3Quote) {
                return {
                  bestQuote: v3Quote.amountOut,
                  isV3Only: true,
                  isV2Only: false,
                  fee: v3Quote.fee,
                };
              } else {
                console.error(
                  'No valid quotes were found for Token to ETH swap.'
                );
                return null;
              }
            };

            const getTokenToTokenBestQuote = async () => {
              let v2Quote = null;
              let v3Quote = null;
              let v3QuoteFee = null;
              let v3QuoteFeeIn = null;
              let v3QuoteFeeOut = null;
              let v2ToV3Quote = null;
              let v3ToV2Quote = null;

              const pathV2 = [
                ALL_TOKENS[sellToken].address,
                wethAddress,
                ALL_TOKENS[buyToken].address,
              ];
              const pathV3 = {
                tokenIn: ALL_TOKENS[sellToken].address,
                tokenOut: ALL_TOKENS[buyToken].address,
              };

              try {
                const amountsOutV2 = await routerContract.getAmountsOut(
                  parsedSellAmount,
                  pathV2
                );
                v2Quote = amountsOutV2[amountsOutV2.length - 1]; // Assuming last amount is the output
                console.log('V2 Quote:', v2Quote);
              } catch (error) {
                console.error('Error fetching V2 quote:', error);
              }

              // Try fetching V3 quote directly
              try {
                const directV3Quote = await getQuoteV3(
                  pathV3.tokenIn,
                  pathV3.tokenOut,
                  parsedSellAmount,
                  chainId
                );
                v3Quote = directV3Quote.amountOut;
                v3QuoteFee = directV3Quote.fee;
                v3QuoteFeeIn = directV3Quote.feeIn;
                v3QuoteFeeOut = directV3Quote.feeOut;

                console.log('V3 Direct Quote:', directV3Quote);
              } catch (error) {
                console.error('Error fetching V3 direct quote:', error);
              }
              // sell token to weth v2 to buy token v3
              try {
                const amountsOutV2ToV3 = await routerContract.getAmountsOut(
                  parsedSellAmount,
                  [ALL_TOKENS[sellToken].address, wethAddress]
                );
                const v2ToV3 = await getQuoteV3(
                  wethAddress,
                  ALL_TOKENS[buyToken].address,
                  amountsOutV2ToV3[1],
                  chainId
                );
                v2ToV3Quote = v2ToV3.amountOut;
                v3QuoteFee = v2ToV3.fee;
                console.log('V2 to V3 Quote:', v2ToV3Quote);
              } catch (error) {
                console.error('Error fetching V2 to V3 quote:', error);
              }
              try {
                const v3ToV2 = await getQuoteV3(
                  ALL_TOKENS[sellToken].address,
                  wethAddress,
                  parsedSellAmount,
                  chainId
                );
                v3QuoteFee = v3ToV2.fee;
                const amountsOutV3ToV2 = await routerContract.getAmountsOut(
                  v3ToV2.amountOut,
                  [wethAddress, ALL_TOKENS[buyToken].address]
                );
                v3ToV2Quote = amountsOutV3ToV2[1];
                console.log('V3 to V2 Quote:', v3ToV2Quote);
              } catch (error) {
                console.error('Error fetching V3 to V2 quote:', error);
              }
              const quotes = [
                v2Quote,
                v3Quote,
                v2ToV3Quote,
                v3ToV2Quote,
              ].filter((q) => q !== null);
              if (quotes.length === 0) {
                console.error(
                  'No valid quotes were found for Token to Token swap.'
                );
                return {bestQuote: 0, isV3Only: false, isV2Only: false, fee: 0};
              }

              // Determine the best quote from all available quotes
              let bestQuote = quotes.reduce((max, quote) => {
                if (quote > max) {
                  console.log(`New best quote found: ${quote}`);
                  return quote;
                }
                return max;
              }, BigInt(0));

              console.log(
                `Overall best quote before any comparison: ${bestQuote}`
              );

              // Identify the best direct quote for comparison
              const directQuotes = [v2Quote, v3Quote].filter(Boolean); // Filter out non-existent direct quotes
              const bestDirectQuote = directQuotes.reduce((max, quote) => {
                if (quote > max) {
                  console.log(`New best direct quote found: ${quote}`);
                  return quote;
                }
                return max;
              }, BigInt(0));

              console.log(
                `Best direct quote for comparison: ${bestDirectQuote}`
              );

              // Checking improvement percentage if the best quote is from a mixed route
              if (
                [v2ToV3Quote, v3ToV2Quote].includes(bestQuote) &&
                bestQuote !== BigInt(0) &&
                bestDirectQuote !== BigInt(0)
              ) {
                const improvement =
                  ((bestQuote - bestDirectQuote) * BigInt(100)) /
                  bestDirectQuote;
                console.log(
                  `Improvement percentage: ${improvement}% from mixed route`
                );

                // Use the best direct quote if mixed route improvement is less than 5%
                if (improvement < BigInt(5)) {
                  console.log(
                    'Choosing the best direct quote due to less than 5% improvement by mixed route.'
                  );
                  bestQuote = bestDirectQuote;
                }
              }

              // Update flags based on the final selected best quote
              const isV3Only = [v3Quote].includes(bestQuote);
              const isV2Only = [v2Quote].includes(bestQuote);
              const isV2ToV3 = [v2ToV3Quote].includes(bestQuote);
              const isV3ToV2 = [v3ToV2Quote].includes(bestQuote);

              // Extract the fee if the final best quote is from a V3 route
              const fee = isV3Only ? v3QuoteFee : 0;

              console.log(`Final selected best quote: ${bestQuote}`);
              console.log(
                `Route details - Is V3 only: ${isV3Only}, Is V2 only: ${isV2Only}, Is V2 to V3: ${isV2ToV3}, Is V3 to V2: ${isV3ToV2}`
              );

              return {
                bestQuote: bestQuote, // Convert BigInt to string for readability
                isV3Only,
                isV2Only,
                isV2ToV3,
                isV3ToV2,
                fee,
                v3QuoteFeeIn,
                v3QuoteFeeOut,
              };
            };
            const swapType = defineSwapType();
            console.log('swapType', swapType);
            let bestQuote;
            switch (swapType) {
              case 'ETH/TOKEN':
                bestQuote = await getEthToTokenBestQuote();
                break;
              case 'TOKEN/ETH':
                bestQuote = await getTokenToEthBestQuote();
                break;
              case 'TOKEN/TOKEN':
                bestQuote = await getTokenToTokenBestQuote();
                break;
              default:
                throw new Error('Invalid swap type');
            }
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

            const data = {
              fromTokenAddress: ALL_TOKENS[sellToken].address,
              buyAmount: bestQuote.bestQuote,
              sellTokenAddress: ALL_TOKENS[sellToken].address,
              buyTokenAddress: ALL_TOKENS[buyToken].address,
              amount: parsedSellAmount,
              isV3Only: bestQuote.isV3Only,
              isV2Only: bestQuote.isV2Only,
              isV2ToV3: bestQuote.isV2ToV3,
              isV3ToV2: bestQuote.isV3ToV2,
              swapType: swapType,
              sqrtPriceLimitX96: 0,
              deadline: deadline,
              v3QuoteFeeIn: bestQuote.v3QuoteFeeIn || 0,
              v3QuoteFeeOut: bestQuote.v3QuoteFeeOut || 0,
              fee: bestQuote.fee,
            };
            console.log('--- data', data);
            return data;
          } catch (error) {
            console.error('error', error);
            return null;
          }
        }

        const price = await getPriceData();
        let swapDataFormat;

        swapDataFormat = {
          fromTokenAddress: price.sellTokenAddress,
          tokenIn: price.sellTokenAddress,
          toTokenAddress: price.buyTokenAddress,
          tokenOut: price.buyTokenAddress,

          amount: price.amount || '0',
          amountIn: price.amount || '0',
          amountOut: price.buyAmount || '0',
          slippage: slippage,
          to: account,
          recipient: account,
          fee: price.fee,
          isV3Only: price.isV3Only,
          isV2Only: price.isV2Only,
          isV2ToV3: price.isV2ToV3,
          isV3ToV2: price.isV3ToV2,
          swapType: price.swapType,
          sqrtPriceLimitX96: price.sqrtPriceLimitX96,
          deadline: price.deadline,
          feeAddress: feeAddress,
          v3QuoteFeeIn: price.v3QuoteFeeIn,
          v3QuoteFeeOut: price.v3QuoteFeeOut,
        };
        setSwapData(swapDataFormat);

        let formatBuyAmount = ethers.formatUnits(
          price.buyAmount,
          ALL_TOKENS[buyToken]?.decimals
        );
        formatBuyAmount = Number(formatBuyAmount).toFixed(8);
        console.log('➡️➡️formatBuyAmount', formatBuyAmount);
        updateData('savedOutputAmount', formatBuyAmount);
      } catch (e) {
        console.log('error', e);
      }
    }

    if (error || loading || !swapData) {
      // updateData('savedOutputAmount', 0);
      return <div className='swap-button disable'>Input Amount</div>;
    }
    console.log('swapData', swapData);

    function SwapFinal({swapData, slippage}) {
      function ApproveOrSwap({swapData}) {
        const largeAmount = 11579208923731619542357098500868790n;

        const {account, signer, updateData} = useContext(BlockchainContext);
        const provider = new ethers.JsonRpcProvider(CHAINS[chainId].rpcUrl);
        const [isApprovalNeeded, setIsApprovalNeeded] = useState(false);

        useEffect(() => {
          const checkAllowance = async () => {
            try {
              if (sellToken === 'eth') {
                if (isApprovalNeeded) {
                  // Check if the state needs updating
                  setIsApprovalNeeded(false);
                }
                return;
              }
              const tokenContract = new ethers.Contract(
                ALL_TOKENS[sellToken].address,
                erc20Abi,
                signer
              );

              const allowance = await tokenContract.allowance(
                account,
                routerAddress
              );

              //   console.log('✅ allowance', allowance);
              const bigIntAllowance = BigInt(allowance);
              //    console.log('bigIntAllowance', bigIntAllowance);

              const fiftyPercentOfLargeAmount = largeAmount / 2n;
              let newApprovalNeeded =
                bigIntAllowance < fiftyPercentOfLargeAmount;
              const inputAmount = swapData.amount;
              //     console.log('inputAmount', inputAmount);
              if (bigIntAllowance < inputAmount) {
                newApprovalNeeded = true;
              } else if (bigIntAllowance >= inputAmount) {
                newApprovalNeeded = false;
              }

              // Only update state if it has changed
              setIsApprovalNeeded(newApprovalNeeded);
            } catch (error) {
              console.error('Failed to fetch allowance:', error);
            }
          };
          checkAllowance();

          const intervalId = setInterval(checkAllowance, 5000); // Set up the polling interval

          return () => clearInterval(intervalId); // Clean up the interval on component unmount
        }, [sellToken, isApprovalNeeded, setIsApprovalNeeded]);
        const handleApprove = async () => {
          try {
            toast.info('Please approve the transaction in your wallet');
            disableSwapContainer();

            const tokenContract = new ethers.Contract(
              ALL_TOKENS[sellToken].address,
              erc20Abi,
              signer
            );
            let requiredAmount = swapData.amount;
            requiredAmount = String(requiredAmount);

            const approveTx = await tokenContract.approve(
              swapData.isV3Only ? routerAddress : routerAddress,
              largeAmount
            );
            console.log('Transaction Hash:', approveTx.hash);

            toast.info('Approval pending');
            const approvalReceipt = await approveTx.wait();
            if (approvalReceipt.status === 1) {
              toast.success('Approval successful');
              enableSwapContainer();
              setIsApprovalNeeded(false);
            } else {
              enableSwapContainer();
              setIsApprovalNeeded(true);
              toast.error('Approval failed');
              console.error('Failed to approve');
              return;
            }
          } catch (error) {
            console.error('Failed to approve:', error);
          } finally {
            enableSwapContainer();
          }
        };

        const handleSwap = async () => {
          try {
            toast.info('Please confirm the transaction in your wallet');
            disableSwapContainer();
            const routerContract = new ethers.Contract(
              routerAddress,
              routerABI,
              signer
            );
            let transactionResponse;
            let estimatedGas;
            function addGasBuffer(gasLimit) {
              let gas = Number(gasLimit);
              let buffer = gas * 0.1;
              let totalGas = gas + buffer;
              return Math.ceil(totalGas);
              //      return gasLimit;
            }
            async function preventOverMax(inputAmount) {
              try {
                // Convert inputAmount to BigInt
                let inputAmountBN = BigInt(inputAmount.toString());
                let userBalanceBN;
                let result;

                if (sellToken === 'eth') {
                  // Get balance as BigInt
                  userBalanceBN = BigInt(await provider.getBalance(account));
                } else {
                  const tokenContract = new ethers.Contract(
                    ALL_TOKENS[sellToken].address,
                    erc20Abi,
                    provider
                  );
                  // Get token balance as BigInt
                  userBalanceBN = BigInt(
                    await tokenContract.balanceOf(account)
                  );
                }

                if (inputAmountBN > userBalanceBN) {
                  // If the input amount is greater than the user's balance, use the user's balance
                  result = userBalanceBN;
                } else {
                  // Otherwise, use the input amount
                  result = inputAmountBN;
                }

                // Return the result as a string to maintain compatibility with functions expecting BigNumberish values
                return result.toString();
              } catch (error) {
                console.error('Failed to preventOverMax:', error);
              }
            }
            async function getGasFees() {
              try {
                const payload = {
                  jsonrpc: '2.0',
                  id: 1,
                  method: 'bn_gasPrice',
                  params: [{chainid: 1}], // Replace with the appropriate chain ID, 1 for Ethereum Mainnet
                };

                const data = await provider.send(
                  payload.method,
                  payload.params
                );
                console.log('data', data);
                const estimatedPrices = data.blockPrices[0].estimatedPrices;

                // Select the appropriate gas price level (e.g., fast, standard, or safe low)
                const recommended = estimatedPrices.find(
                  (price) => price.confidence === 95
                ); // 99% confidence level

                const maxPriorityFeePerGas = ethers.parseUnits(
                  String(recommended.maxPriorityFeePerGas),
                  'gwei'
                );
                const maxFeePerGas = ethers.parseUnits(
                  String(recommended.maxFeePerGas),
                  'gwei'
                );

                console.log(
                  'maxPriorityFeePerGas',
                  maxPriorityFeePerGas.toString()
                );
                console.log('maxFeePerGas', maxFeePerGas.toString());

                return {
                  maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
                  maxFeePerGas: maxFeePerGas.toString(),
                };
              } catch (error) {
                console.error('Failed to getGasFees:', error);
              }
            }

            /*    async function getGasFees() {
  try {
    console.log(savedAddedPriority);
    let gasLevel = gasLevelRef.current;
    const feeData = await provider.getFeeData();

    // Using BigInt directly for calculations
    const baseFeePerGas = feeData.lastBaseFeePerGas;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    
    console.log('baseFeePerGas', baseFeePerGas.toString());
    console.log('maxPriorityFeePerGas', maxPriorityFeePerGas.toString());

    let priorityFeePerGas = maxPriorityFeePerGas; // Default to the network-recommended priority fee

    if (savedAddedPriority.current > 0) {
      priorityFeePerGas = ethers.parseUnits(
        String(savedAddedPriority.current),
        'gwei'
      );
      console.log('User-set priorityFeePerGas', priorityFeePerGas.toString());
    }

    console.log('Final priorityFeePerGas', priorityFeePerGas.toString());

    return {
      priorityFeePerGas: priorityFeePerGas.toString(),
    };
  } catch (error) {
    console.error('Failed to getGasFees:', error);
  }
} */

            const gasFees = await getGasFees();

            async function reduceAmountOut(amountOut) {
              try {
                let minAmountOut = amountOut; // Convert to BigInt

                try {
                  const slippage = Number(savedSlippage.current) / 100;
                  console.log(slippage, ' slippage');

                  let slippagePercentage = BigInt(
                    Math.floor(Number(slippage) * 100)
                  );
                  // Perform multiplication first to avoid losing precision, then divide by 100
                  let slippageAmount =
                    (minAmountOut * slippagePercentage) / BigInt(100);

                  minAmountOut = minAmountOut - slippageAmount;
                  console.log('minAmountOut', minAmountOut);
                  if (minAmountOut < BigInt(0)) {
                    minAmountOut = BigInt(0);
                  }
                } catch (e) {
                  console.error('error', e);
                  minAmountOut = BigInt(0);
                }
                return minAmountOut;
              } catch (error) {
                console.error(error);
              }
            }
            async function depositEth() {
              const wethContract = new ethers.Contract(
                wethAddress,
                wethABI,
                signer
              );
              let estimatedGas = await wethContract.deposit.estimateGas({
                value: swapData.amount,
              });
              estimatedGas = addGasBuffer(estimatedGas);
              transactionResponse = await wethContract.deposit({
                value: swapData.amount,
                gasLimit: estimatedGas,
              });

              return;
            }
            async function withdrawEth() {
              const wethContract = new ethers.Contract(
                wethAddress,
                wethABI,
                signer
              );
              let estimatedGas = await wethContract.withdraw.estimateGas(
                swapData.amount
              );
              estimatedGas = addGasBuffer(estimatedGas);
              transactionResponse = await wethContract.withdraw(
                swapData.amount,
                {gasLimit: estimatedGas}
              );
              return;
            }
            if (
              ALL_TOKENS[sellToken].symbol === 'ETH' &&
              ALL_TOKENS[buyToken].symbol === 'WETH'
            ) {
              await depositEth();
            } else if (
              ALL_TOKENS[sellToken].symbol === 'WETH' &&
              ALL_TOKENS[buyToken].symbol === 'ETH'
            ) {
              await withdrawEth();
            } else {
              if (swapData.isV3Only === true) {
                let safeInputAmount = await preventOverMax(swapData.amountIn);
                if (swapData.swapType === 'TOKEN/ETH') {
                  console.log('swapData', swapData);
                  estimatedGas = await routerContract.tokenToEthV3.estimateGas(
                    swapData.tokenIn,
                    swapData.tokenOut,
                    swapData.fee,
                    swapData.recipient,
                    safeInputAmount,
                    reduceAmountOut(swapData.amountOut),
                    {
                      maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                      maxFeePerGas: gasFees.maxFeePerGas,
                    }
                  );
                  console.log('estimatedGas', estimatedGas);

                  transactionResponse = await routerContract.tokenToEthV3(
                    swapData.tokenIn,
                    swapData.tokenOut,
                    swapData.fee,
                    swapData.recipient,
                    safeInputAmount,
                    reduceAmountOut(swapData.amountOut),

                    {
                      maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                      maxFeePerGas: gasFees.maxFeePerGas,
                      gasLimit: addGasBuffer(estimatedGas),
                    }
                  );
                } else if (swapData.swapType === 'ETH/TOKEN') {
                  estimatedGas = await routerContract.ethToTokenV3.estimateGas(
                    swapData.tokenIn,
                    swapData.tokenOut,
                    swapData.fee,
                    swapData.recipient,
                    reduceAmountOut(swapData.amountOut),
                    {
                      maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                      maxFeePerGas: gasFees.maxFeePerGas,
                      value: safeInputAmount,
                    }
                  );

                  transactionResponse = await routerContract.ethToTokenV3(
                    swapData.tokenIn,
                    swapData.tokenOut,
                    swapData.fee,
                    swapData.recipient,
                    reduceAmountOut(swapData.amountOut),
                    {
                      maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                      maxFeePerGas: gasFees.maxFeePerGas,
                      value: safeInputAmount,
                      gasLimit: addGasBuffer(estimatedGas),
                    }
                  );
                } else if (swapData.swapType === 'TOKEN/TOKEN') {
                  estimatedGas =
                    await routerContract.tokenToTokenV3.estimateGas(
                      swapData.tokenIn,
                      swapData.tokenOut,
                      swapData.v3QuoteFeeIn,
                      swapData.v3QuoteFeeOut,
                      swapData.recipient,
                      safeInputAmount,
                      reduceAmountOut(swapData.amountOut),
                      {
                        maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                        maxFeePerGas: gasFees.maxFeePerGas,
                      }
                    );
                  console.log('estimatedGas', estimatedGas);

                  transactionResponse = await routerContract.tokenToTokenV3(
                    swapData.tokenIn,
                    swapData.tokenOut,
                    swapData.v3QuoteFeeIn,
                    swapData.v3QuoteFeeOut,
                    swapData.recipient,
                    safeInputAmount,
                    reduceAmountOut(swapData.amountOut),
                    {
                      maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                      maxFeePerGas: gasFees.maxFeePerGas,
                    }
                  );
                }
              } else if (swapData.isV2Only === true) {
                if (swapData.swapType === 'ETH/TOKEN') {
                  let safeInputAmount = await preventOverMax(swapData.amount);
                  console.log('swapData', swapData);
                  estimatedGas =
                    await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens.estimateGas(
                      reduceAmountOut(swapData.amountOut),
                      [wethAddress, swapData.toTokenAddress],
                      swapData.to,
                      swapData.deadline,
                      {
                        maxFeePerGas: gasFees.maxFeePerGas,
                        maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                        value: safeInputAmount,
                      }
                    );
                  transactionResponse =
                    await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(
                      reduceAmountOut(swapData.amountOut),
                      [wethAddress, swapData.toTokenAddress],
                      swapData.to,
                      swapData.deadline,
                      {
                        maxFeePerGas: gasFees.maxFeePerGas,
                        maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
                        gasLimit: addGasBuffer(estimatedGas),
                        value: safeInputAmount,
                      }
                    );
                } else if (swapData.swapType === 'TOKEN/ETH') {
                  let safeInputAmount = await preventOverMax(swapData.amountIn);
                  estimatedGas =
                    await routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens.estimateGas(
                      safeInputAmount,
                      reduceAmountOut(swapData.amountOut),
                      [swapData.fromTokenAddress, wethAddress],
                      swapData.to,
                      swapData.deadline,
                      {
                        maxFeePerGas: gasFees.maxFeePerGas,
                        maxPriorityFeePerGas: gasFees.priorityFeePerGas,
                        from: account,
                      }
                    );
                  transactionResponse =
                    await routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens(
                      safeInputAmount,
                      reduceAmountOut(swapData.amountOut),
                      [swapData.fromTokenAddress, wethAddress],
                      swapData.to,
                      swapData.deadline,
                      {
                        //    maxFeePerGas: gasFees.maxFeePerGas,
                        //   maxPriorityFeePerGas: gasFees.priorityFeePerGas,
                        gasPrice: gasFees.maxFeePerGas,
                        gasLimit: addGasBuffer(estimatedGas),
                      }
                    );
                } else {
                  let safeInputAmount = await preventOverMax(swapData.amountIn);
                  estimatedGas =
                    await routerContract.swapExactTokensForTokensSupportingFeeOnTransferTokens.estimateGas(
                      safeInputAmount,
                      reduceAmountOut(swapData.amountOut),
                      [
                        swapData.fromTokenAddress,
                        weth,
                        swapData.toTokenAddress,
                      ],
                      swapData.to,
                      swapData.deadline,
                      swapData.feeAddress,
                      {
                        //     maxFeePerGas: gasFees.maxFeePerGas,
                        //    maxPriorityFeePerGas: gasFees.priorityFeePerGas,
                        gasPrice: gasFees.maxFeePerGas,
                      }
                    );
                  transactionResponse =
                    await routerContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                      safeInputAmount,
                      reduceAmountOut(swapData.amountOut),
                      [
                        swapData.fromTokenAddress,
                        weth,
                        swapData.toTokenAddress,
                      ],
                      swapData.to,
                      swapData.deadline,
                      swapData.feeAddress,
                      {
                        //    maxFeePerGas: gasFees.maxFeePerGas,
                        //   maxPriorityFeePerGas: gasFees.priorityFeePerGas,
                        gasPrice: gasFees.maxFeePerGas,
                        gasLimit: addGasBuffer(estimatedGas),
                      }
                    );
                }
              }
            }
            toast.info('Trade pending');
            const sendTransaction = await transactionResponse.wait();
            if (sendTransaction.status === 1) {
              toast.success('Trade successful');
              enableSwapContainer();
              setTrigger(trigger + 1);
              updateData('savedInputAmount', '');
              updateData('savedOutputAmount', '');
            }
            if (sendTransaction.status === 0) {
              toast.error('Trade failed');
              setTrigger(trigger + 1);

              enableSwapContainer();
            }
          } catch (error) {
            enableSwapContainer();
            console.error('Failed to swap:', error);
            toast.error(
              'Simulated trade failed, check eth input, gas or try increasing slippage'
            );
            //      toast.info('Increasing your slippage by 1%');
            //   updateData('savedSlippage', Number(slippage * 100) + 1);
            return;
          }
        };

        return (
          <>
            {isApprovalNeeded === null ? (
              <div className='swap-button'>Input Amount</div> // Empty div for null case, adjust as needed
            ) : isApprovalNeeded ? (
              <div className='swap-button' onClick={handleApprove}>
                Approve
              </div>
            ) : (
              <div className='swap-button' onClick={handleSwap}>
                Swap
              </div>
            )}
          </>
        );
      }

      return (
        <>
          {swapData && <ApproveOrSwap swapData={swapData} />}
          {!swapData && <div className='swap-button'>Input Amount</div>}
        </>
      );
    }
    return <SwapFinal swapData={swapData} />;
  }

  const contractRef = useRef('');

  async function handleContractImport(value) {
    if (value.length === 42) {
      try {
        const tokenContract = new ethers.Contract(value, erc20Abi, provider);
        const symbol = await tokenContract.symbol();
        const name = await tokenContract.name();
        const decimals = await tokenContract.decimals();
        const logoURI = `https://i.ibb.co/nLdSWMh/plat.jpg`;
        const newToken = {
          chainId: chainId,
          name: name,
          symbol: symbol,
          address: value,
          decimals: typeof decimals === 'bigint' ? Number(decimals) : decimals,
          logoURI: logoURI,
        };
        try {
          if (!ALL_TOKENS[symbol.toLowerCase()]) {
            const customTokens =
              JSON.parse(localStorage.getItem('customTokens')) || {};
            customTokens[symbol.toLowerCase()] = newToken;
            localStorage.setItem('customTokens', JSON.stringify(customTokens));
            toast.success(`${symbol} imported successfully`);
            const lowerCaseSymbol = symbol.toLowerCase();
            contractRef.current.value = '';
            //    setTrigger((prev) => prev + 1);
            setBuyToken(lowerCaseSymbol);
            if (showTokenList !== false) {
              setShowTokenList(false);
            }
          } else {
            setBuyToken(symbol.toLowerCase());
            console.warn(`Token ${symbol} already exists in ALL_TOKENS.`);
            if (showTokenList !== false) {
              setShowTokenList(false);
            }
          }
        } catch (error) {
          console.error('Failed to import token:', error);
          toast.error('Failed to import token');
        }
      } catch (error) {
        console.error('Failed to import token:', error);
      }
    } else {
      return;
    }
  }

  let chartTokenAddress;
  try {
    if (buyToken === 'eth') {
      chartTokenAddress = ALL_TOKENS[sellToken].address;
    } else {
      chartTokenAddress = ALL_TOKENS[buyToken].address;
    }
  } catch (error) {
    // Handle the error here
    console.error(error);
  }

  function NavBar() {
    return (
      <div className='nav-container'>
        <div className='nav-left'>
          <img
            src={'/logo.png'}
            alt={''}
            width={45}
            height={45}
            style={{
              objectFit: 'contain',
              borderRadius: '50%',
              marginRight: `5px`,
              marginLeft: `5px`,
            }}
            loading='lazy'
          />{' '}
          <div className='col'>
            <div className='logo-text mobhide'>PHENX </div>
            <div
              style={{
                color: 'white',
                fontSize: '10px',
                textAlign: 'center',
                letterSpacing: '7px',
              }}>
              BETA
            </div>
          </div>
          {/*           <PromoToken
            handleBuyTokenChange={handleBuyTokenChange}
            chainId={chainId}
          /> */}
        </div>
        <div className='nav-right'>
          {/*           <Switch text={'Charting'} /> <Switch text={'Portfolio'} />
          <Switch text={'Audits'} /> <Switch text={'AI Reports'} /> */}
          {/*           <input
            className='quick-import'
            placeholder='Paste contract to import'
            type='text'
            ref={contractRef}
            onChange={(e) => handleContractImport(e.target.value)}
          /> */}
          <ConnectButton
            accountStatus={{smallScreen: 'avatar', largeScreen: 'avatar'}}
            chainStatus={{smallScreen: 'icon', largeScreen: 'icon'}}
            showBalance={{smallScreen: false, largeScreen: true}}
            label='Connect Wallet'
          />
        </div>
      </div>
    );
  }
  function FooterBar() {
    return (
      <div className='footer-container'>
        <div className='nav-left'>
          <div className='icons-container'>
            {' '}
            <a
              href='https://t.me/PhenXNetwork'
              title='Telegram'
              target='_blank'
              rel='noopener noreferrer'
              className='icon'>
              {' '}
              <Telegram />
            </a>{' '}
            <a
              href='https://twitter.com/PhenXNetwork'
              title='Twitter'
              target='_blank'
              rel='noopener noreferrer'
              className='icon'>
              {' '}
              <Twitter />
            </a>{' '}
            <a
              href='https://twitter.com/PhenXNetwork'
              title='Medium'
              target='_blank'
              rel='noopener noreferrer'
              className='icon'>
              {' '}
              <Medium />
            </a>
          </div>
        </div>
        <div className='nav-right'>
          {' '}
          <a
            href='https://t.me/PhenXNetwork'
            style={{
              color: 'white',
              fontSize: '14px',
              textAlign: 'center',
              letterSpacing: '7px',
            }}>
            TALK TO US
          </a>
        </div>
      </div>
    );
  }

  const memoNavBar = useMemo(() => <NavBar />, [account]);

  const SaverInfo = () => {
    const uniGasFee = 15.57;
    const uniSwapFee = 81.77;
    const phenGas = uniGasFee * 0.6;
    const phenSwap = 0;
    const gasSaved = uniGasFee - phenGas;
    const swapFeesSaved = uniSwapFee - phenSwap;
    const totalSaved = gasSaved + swapFeesSaved;

    return (
      <div className='saver-info-container disable'>
        <div className='saver-text-container'>
          <div className='saver-text-left'>
            <div className='saver-icon-container'>
              <SaverInfoIcon />
            </div>
          </div>
          <div className='saver-text'>Fee Comparison</div>
        </div>

        <div className='saver-text-container'>
          <div className='saver-text-left'>Uniswap Network Fee</div>
          <div className='saver-text-right'>${uniGasFee.toFixed(2)}</div>
        </div>
        <div className='saver-text-container'>
          <div className='saver-text-left'>PhenX Network Fee</div>
          <div className='saver-text-right'>${phenGas.toFixed(2)}</div>
        </div>
        <div className='saver-text-container'>
          <div className='saver-text-left'>Uniswap Swap Fee</div>
          <div className='saver-text-right'>${uniSwapFee.toFixed(2)}</div>
        </div>
        <div className='saver-text-container'>
          <div className='saver-text-left'>PhenX Swap Fee</div>
          <div className='saver-text-right saver-text'>
            ${phenSwap.toFixed(2)}
          </div>
        </div>
        <div className='saver-text-container'>
          <div className='saver-text-left'>Gas Fees Saved</div>
          <div className='saver-text-right'>${gasSaved.toFixed(2)}</div>
        </div>
        <div className='saver-text-container'>
          <div className='saver-text-left'>Swap Fees Saved</div>
          <div className='saver-text-right'>${swapFeesSaved.toFixed(2)}</div>
        </div>
        <div className='saver-text-container'>
          <div className='saver-text'>Total Saved</div>
          <div className='saver-text'>${totalSaved.toFixed(2)}</div>
        </div>
      </div>
    );
  };

  const memoAudits = useMemo(
    () => <Audit contractAddress={chartTokenAddress} provider={provider} />,
    [chartTokenAddress, showAudits]
  );
  const memoCharts = useMemo(
    () => (
      <Iframe
        chainId={chainId}
        buyToken={chartTokenAddress}
        subTab={'Dexscreener'}
      />
    ),
    [chartTokenAddress, showChart]
  );

  // swap-container if not audit open padding top 200px

  useEffect(() => {
    if (showAudits === false && showChart === false) {
      document.querySelector('.main-container').style.paddingTop = '250px';
    }
    if (showAudits === true && showChart === false) {
      document.querySelector('.main-container').style.paddingTop = '150px';
    }
    if (showChart === true && showAudits === true) {
      document.querySelector('.main-container').style.paddingTop = '100px';
    }
    if (showChart === true && showAudits === false) {
      document.querySelector('.main-container').style.paddingTop = '100px';
    }
  }, [showAudits, showChart]);

  return (
    <div className='whole-container'>
      <div className='bg' />

      <div className='main-container'>
        {memoNavBar}
        <FooterBar />
        <div className='swap-container'>
          {' '}
          <SwapSettings
            setShowChartState={setShowChartState}
            showChart={showChart}
            setShowAudits={setShowAudits}
            showAudits={showAudits}
          />
          {showTokenList === 'sellToken' && (
            <TokenList
              ALL_TOKENS={ALL_TOKENS}
              handleBuyTokenChange={handleBuyTokenChange}
              handleSellTokenChange={handleSellTokenChange}
              type='sellToken'
              handleShowTokenList={handleShowTokenList}
              key={chainId}
              setShowTokenList={setShowTokenList}
              buyToken={buyToken}
              sellToken={sellToken}
              handleContractImport={handleContractImport}
            />
          )}
          {showTokenList === 'buyToken' && (
            <TokenList
              ALL_TOKENS={ALL_TOKENS}
              handleBuyTokenChange={handleBuyTokenChange}
              handleSellTokenChange={handleSellTokenChange}
              type='buyToken'
              handleShowTokenList={handleShowTokenList}
              key={chainId}
              setShowTokenList={setShowTokenList}
              buyToken={buyToken}
              sellToken={sellToken}
              handleContractImport={handleContractImport}
            />
          )}
          <div className='tokens-select-container'>
            <YouPay
              setShowTokenList={handleShowTokenList}
              ALL_TOKENS={ALL_TOKENS}
              sellTokenDisplayBalance={sellTokenDisplayBalance}
            />
            <div className='swap-tokens' onClick={swapTokens}>
              <img src={'/swap-icon.png'} alt={''} width={34} height={34} />
            </div>
            <YouReceive
              setShowTokenList={handleShowTokenList}
              ALL_TOKENS={ALL_TOKENS}
              buyTokenDisplayBalance={buyTokenDisplayBalance}
            />
          </div>{' '}
          <QuoteView /> {/* <SaverInfo /> */}
          {showAudits && memoAudits}
        </div>
        {showChart && <div className='mid-section'>{memoCharts}</div>}{' '}
      </div>
    </div>
  );
};

export default Swap;
