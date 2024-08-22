/* eslint-disable @next/next/no-img-element */
import DollarValue from './DollarValue';
import {BlockchainContext} from './BlockchainContext';
import {useState, useEffect, useContext, useRef, useMemo, use} from 'react';
import {BASE_TOKENS, ETH_TOKENS} from './lib/constants';
import mergeTokens from './mergeTokens';

function Portfolio({
  type,
  handleSellTokenChange,
  handleBuyTokenChange,
  handleShowTokenList,
}) {
  function handleTokenRemoval(symbol) {
    try {
      if (!symbol) {
        console.error('No symbol provided for token removal.');
        return;
      }

      // Retrieve the stored list of custom tokens
      const storedTokens =
        JSON.parse(localStorage.getItem('customTokens')) || {};
      const lowerCaseSymbol = symbol.toLowerCase();
      console.log('Removing token', lowerCaseSymbol);
      // Check if the token exists
      if (storedTokens[lowerCaseSymbol]) {
        // Token exists, delete it from the stored list
        delete storedTokens[lowerCaseSymbol];
        localStorage.setItem('customTokens', JSON.stringify(storedTokens));
      } else {
        // Token does not exist in the stored list
        console.warn(`Token ${symbol} does not exist in custom tokens.`);
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  const CloseIcon = ({symbol}) => {
    return (
      <svg
        onClick={() => handleTokenRemoval(symbol)}
        stroke='currentColor'
        fill='rgba(255, 0, 0, 0.7)'
        strokeWidth='0'
        viewBox='0 0 24 24'
        className='text-highlight'
        height='20'
        width='20'
        xmlns='http://www.w3.org/2000/svg'>
        <path d='M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12,5.7,16.89a1,1,0,1,0,1.41,1.41L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12l4.89-4.89A1,1,0,0,0,18.3,5.71Z' />
      </svg>
    );
  };
  const handleHideToken = (key) => {
    const itemToHide = document.querySelector(`.token-list-item.${key}`);
    if (itemToHide) {
      itemToHide.style.display = 'none'; // Hide the item
    }
  };
  const {dollarRef, account, provider, chainId} = useContext(BlockchainContext);
  const [tokens, setTokens] = useState(mergeTokens(chainId));
  const [newBlock, setNewBlock] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalDollarValue, setTotalDollarValue] = useState(0);

  const blockNumberRef = useRef(0);

  const [dollarRefTrigger, setDollarRefTrigger] = useState(0);

  const previousDollarRef = useRef();
  useEffect(() => {
    try {
      let total;
      total = Object.values(tokens).reduce((sum, token) => {
        return sum + (Number(token.dollarValue) || 0);
      }, 0);
      total = total.toFixed(2);
      setTotalDollarValue(total);
    } catch (e) {
      console.log(e);
    }
  }, [tokens]);
  useEffect(() => {
    const checkNewDollarRef = () => {
      if (previousDollarRef.current !== dollarRef.current) {
        console.log('Change detected in dollarRef.current:', dollarRef.current);
        setDollarRefTrigger((prev) => prev + 1);
        previousDollarRef.current = dollarRef.current;
      }
    };

    const intervalId = setInterval(checkNewDollarRef, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [dollarRef]);

  useEffect(() => {
    let isLoading = false;
    try {
      if (dollarRef.current && account) {
        if (isLoading) {
          console.log('Loading in progress, skipping...');
          return;
        }
        isLoading = true;
        console.log('dollarRef TokenList');
        const tokenEntries = Object.entries(dollarRef.current);

        const firstFourTokens = tokenEntries.slice(0, 3);

        const remainingTokens = tokenEntries
          .slice(3)
          .sort((a, b) => b[1].dollarValue - a[1].dollarValue); // Ensure '0' is considered in the sort

        const sortedTokens = [...firstFourTokens, ...remainingTokens].reduce(
          (acc, [key, value]) => {
            acc[key] = value; // Reconstruct the object with the same keys
            return acc;
          },
          {}
        );

        setTokens(sortedTokens);
      } else {
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  }, [newBlock, account, dollarRef, chainId, dollarRefTrigger]); // Dependencies include dollarRef and account

  return (
    <div className='port-token-list'>
      <div className='total-value'> Portfolio ${totalDollarValue}</div>
      {/*       {Object.entries(tokens).map(([key, token]) => (
       */}{' '}
      {Object.entries(tokens)
        .filter(
          ([key, token]) =>
            token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(([key, token]) => (
          <div
            className={`token-list-item ${key} no-cursor`}
            key={key} // Use the key from the object as the React key
            onClick={() => {
              // Now you can use the key here if needed
              if (type === 'sellToken') {
                handleSellTokenChange(key);
              } else if (type === 'buyToken') {
                handleBuyTokenChange(key);
              }
              handleShowTokenList(false);
            }}>
            <div className='token-list-item-image'>
              <img
                src={token.logoURI}
                alt={'logo'}
                width={36}
                height={36}
                style={{objectFit: 'contain', borderRadius: '50%'}}
                loading='lazy'
              />
            </div>
            <div className='token-list-row-sb'>
              <div className='token-list-col'>
                <div className='token-list-item-text-name'>{token.symbol}</div>
                <div className='portfolio-list-buttons'>
                  <div
                    className='portfolio-list-button'
                    onClick={() => {
                      handleBuyTokenChange(key, true);
                    }}>
                    Buy
                  </div>
                  <div
                    className='portfolio-list-button red-shadow'
                    onClick={() => {
                      handleSellTokenChange(key, true);
                    }}>
                    Sell
                  </div>
                </div>
              </div>
              <div className='token-list-col-right'>
                <div className='token-list-item-text-name'>{token.balance}</div>

                <div className='token-list-item-text-symbol'>
                  {account && (
                    <div className='token-list-item-text-symbol'>
                      {token.dollarValue === undefined
                        ? '$00.00'
                        : '$' + token.dollarValue}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {ETH_TOKENS[key] === undefined &&
              BASE_TOKENS[key] === undefined && (
                <div
                  className='token-list-remove'
                  onClick={(event) => {
                    event.stopPropagation(); // Prevents the click event from propagating to parent elements.
                    handleHideToken(key);
                  }}>
                  <CloseIcon symbol={key} />
                </div>
              )}
          </div>
        ))}
    </div>
  );
}
export default Portfolio;
