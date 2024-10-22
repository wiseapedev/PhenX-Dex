/* import {BlockchainContext} from './BlockchainContext';
import {useState, useEffect, useContext, useRef, useMemo, use} from 'react';

function TokenList({
  type,
  handleSellTokenChange,
  handleBuyTokenChange,
  handleShowTokenList,
  buyToken,
  sellToken,
  handleContractImport,
}) {
  const {dollarRef, account, provider, chain_id, ALL_TOKENS} =
    useContext(BlockchainContext);
  const [tokens, setTokens] = useState(ALL_TOKENS);
  const [newBlock, setNewBlock] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  function handleSearchAndImport(value) {
    setSearchTerm(value);
    if (value.length === 42) {
      setTimeout(() => {
        handleContractImport(value);
      }, 500);
    }
  }

  const [dollarRefTrigger, setDollarRefTrigger] = useState(0);

  const previousDollarRef = useRef();

  useEffect(() => {
    const checkNewDollarRef = () => {
      if (previousDollarRef.current !== dollarRef.current) {
        //    console.log('Change detected in dollarRef.current:', dollarRef.current);
        setDollarRefTrigger((prev) => prev + 1);
        previousDollarRef.current = dollarRef.current;
      }
    };

    const intervalId = setInterval(checkNewDollarRef, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [dollarRef]);
  const tokenListRef = useRef(null);

  // Effect to detect clicks outside the token list
  useEffect(() => {
    const handleClickOutside = (event) => {
      //    console.log('Event Target:', event.target);
      ///   console.log('Token List Ref Current:', tokenListRef.current);

      // Check if click was outside the token list
      if (
        tokenListRef.current &&
        !tokenListRef.current.contains(event.target)
      ) {
        handleShowTokenList(false);
        //    console.log('Clicked outside the token list');
      }
    };

    // Add event listener for outside clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isLoading = false;
    try {
      if (dollarRef.current && account) {
        if (isLoading) {
          console.log('Loading in progress, skipping...');
          return;
        }

        //      console.log('dollarRef.current:', dollarRef.current);
        isLoading = true;
        //     console.log('Processing dollarRef TokenList...');

        const tokenEntries = Object.entries(dollarRef.current);
        //   console.log('Token entries:', tokenEntries);

        const firstFourTokens = tokenEntries.slice(0, 1);

        const remainingTokens = tokenEntries.slice(1).sort((a, b) => {
          return Number(b[1].dollarValue) - Number(a[1].dollarValue);
        });

        //  console.log('Remaining tokens after sort:', remainingTokens);

        const sortedTokens = [...firstFourTokens, ...remainingTokens].reduce(
          (acc, [key, value]) => {
            acc[key] = value; // Reconstruct the object with the same keys
            //    console.log('Accumulating token:', {key, value});
            return acc;
          },
          {}
        );

        //      console.log('Sorted tokens:', sortedTokens);
        setTokens(sortedTokens);
      } else {
        // console.log('dollarRef.current or account is not available.');
      }
    } catch (error) {
      //   console.error('Error in useEffect:', error);
    } finally {
      isLoading = false;
      //     console.log('Loading process complete, isLoading set to false.');
    }
  }, [account, dollarRef, chain_id, dollarRefTrigger]); // Dependencies include dollarRef and account

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const filteredAndSortedTokens = useMemo(() => {
    return Object.entries(tokens)
      .filter(
        ([key, token]) =>
          token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => Number(b[1].dollarValue) - Number(a[1].dollarValue));
  }, [tokens, searchTerm]);

  return (
    <div className={`token-list-container ${fadeIn ? 'fade-in' : ''}`}>
      <div className='token-list' ref={tokenListRef}>
        <div className='token-list-top'>
          <div className='inputWithIcon'>
            <svg
              className='inputIcon'
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 24 24'
              height='1.4rem'
              width='1.4rem'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                d='M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z'
              />
            </svg>
            <input
              className='quick-import-bar'
              type='text'
              placeholder='Search name or paste contract'
              value={searchTerm}
              onChange={(e) => handleSearchAndImport(e.target.value)}
            />
          </div>
          <div className='base-tokens-section'>
            <div className='base-tokens'>
              {Object.entries(tokens)
                .filter(([key, token]) => token.is_partner)
                .map(([key, token]) => (
                  <div
                    className={`base-item ${token.is_partner ? 'partner' : ''}`}
                    key={key}
                    onClick={() => {
                      // Now you can use the key here if needed
                      if (type === 'sellToken') {
                        handleSellTokenChange(key);
                      } else if (type === 'buyToken') {
                        handleBuyTokenChange(key);
                      }
                      handleShowTokenList(false);
                    }}>
                    <img
                      src={token.logo_uri}
                      alt={token.name}
                      className='token-logo'
                      width={25}
                      height={25}
                      style={{
                        objectFit: 'contain',
                        borderRadius: '50%',
                        marginRight: '2px',
                      }}
                    />
                    <div className='base-symbol'>{token.symbol}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className='token-list-items'>
          {filteredAndSortedTokens.map(([key, token]) => (
            <div
              className={`token-list-item ${key} ${
                buyToken === key || sellToken === key ? 'disable' : ''
              }`}
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
                  src={token.logo_uri}
                  alt={'logo'}
                  width={36}
                  height={36}
                  style={{objectFit: 'contain', borderRadius: '50%'}}
                  loading='lazy'
                />
              </div>
              <div className='token-list-row-sb'>
                <div className='token-list-col'>
                  <div className='token-list-item-text-name'>
                    {token.symbol}
                  </div>
                  <div className='token-list-item-text-symbol'>
                    {token.name}
                  </div>
                </div>
                <div className='token-list-col-right'>
                  <div className='token-list-item-text-name'>
                    {account && (
                      <div className='token-list-item-text-name'>
                        {token.dollarValue === undefined ||
                        token.dollarValue === null ||
                        token.dollarValue === ''
                          ? ''
                          : '$' + token.dollarValue}
                      </div>
                    )}
                  </div>{' '}
                  <div className='token-list-item-text-symbol'>
                    {token.balance === undefined ? '' : token.balance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default TokenList;
 */

import {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {BlockchainContext} from './BlockchainContext';

function TokenList({
  type,
  handleSellTokenChange,
  handleBuyTokenChange,
  handleShowTokenList,
  buyToken,
  sellToken,
  handleContractImport,
}) {
  const {dollarRef, account, chain_id, ALL_TOKENS} =
    useContext(BlockchainContext);
  const [tokens, setTokens] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [searchTerm, setSearchTerm] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [dollarRefTrigger, setDollarRefTrigger] = useState(0);
  const previousDollarRef = useRef(null);
  const tokenListRef = useRef(null);

  // Function to handle search and contract import
  const handleSearchAndImport = (value) => {
    setSearchTerm(value);
    if (value.length === 42) {
      setTimeout(() => {
        handleContractImport(value);
      }, 500);
    }
  };

  // Track and trigger updates when dollarRef changes
  useEffect(() => {
    const checkNewDollarRef = () => {
      if (dollarRef?.current !== previousDollarRef.current) {
        setDollarRefTrigger((prev) => prev + 1);
        previousDollarRef.current = dollarRef?.current;
      }
    };

    const intervalId = setInterval(checkNewDollarRef, 500);
    return () => clearInterval(intervalId);
  }, [dollarRef]);

  // Handle clicks outside the token list to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tokenListRef.current &&
        !tokenListRef.current.contains(event.target)
      ) {
        handleShowTokenList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tokenListRef]);

  // Fetch and process tokens when the component mounts or dependencies change
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        if (dollarRef?.current && account) {
          const tokenEntries = Object.entries(dollarRef.current);

          // Slice and sort tokens based on dollarValue
          const firstFourTokens = tokenEntries.slice(0, 1);
          const remainingTokens = tokenEntries.slice(1).sort((a, b) => {
            return (
              Number(b[1]?.dollarValue || 0) - Number(a[1]?.dollarValue || 0)
            );
          });

          // Combine the sorted tokens
          const sortedTokens = [...firstFourTokens, ...remainingTokens].reduce(
            (acc, [key, value]) => {
              acc[key] = value; // Reconstruct the tokens object
              return acc;
            },
            {}
          );
          setTokens(sortedTokens); // Update the token state
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false); // Loading process is complete
      }
    };

    fetchTokens();
  }, [account, dollarRef, chain_id, dollarRefTrigger]);

  // Enable fade-in effect
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Filter and sort tokens based on search term
  const filteredAndSortedTokens = useMemo(() => {
    return Object.entries(tokens)
      .filter(
        ([, token]) =>
          token?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(
        (a, b) =>
          Number(b[1]?.dollarValue || 0) - Number(a[1]?.dollarValue || 0)
      );
  }, [tokens, searchTerm]);

  // Ensure that all required values are available before rendering
  if (loading || !dollarRef || !account || Object.keys(tokens).length === 0) {
    return (
      <div className={`token-list-container ${fadeIn ? 'fade-in' : ''}`}>
        <div className='token-list'>
          <div className='loader loader11'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>{' '}
        </div>
      </div>
    );
  }

  // Render the token list
  return (
    <div className={`token-list-container ${fadeIn ? 'fade-in' : ''}`}>
      <div className='token-list' ref={tokenListRef}>
        <div className='token-list-top'>
          <div className='inputWithIcon'>
            <svg
              className='inputIcon'
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 24 24'
              height='1.4rem'
              width='1.4rem'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                d='M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z'
              />
            </svg>
            <input
              className='quick-import-bar'
              type='text'
              placeholder='Search name or paste contract'
              value={searchTerm}
              onChange={(e) => handleSearchAndImport(e.target.value)}
            />
          </div>
          <div className='base-tokens-section'>
            <div className='base-tokens'>
              {Object.entries(tokens)
                .filter(([, token]) => token?.is_partner)
                .map(([key, token]) => (
                  <div
                    className={`base-item ${
                      token?.is_partner ? 'partner' : ''
                    }`}
                    key={key}
                    onClick={() => {
                      if (type === 'sellToken') handleSellTokenChange(key);
                      if (type === 'buyToken') handleBuyTokenChange(key);
                      handleShowTokenList(false);
                    }}>
                    <img
                      src={token?.logo_uri || '/default-image.png'}
                      alt={token?.name || 'token'}
                      className='token-logo'
                      width={25}
                      height={25}
                      style={{
                        objectFit: 'contain',
                        borderRadius: '50%',
                        marginRight: '2px',
                      }}
                    />
                    <div className='base-symbol'>{token?.symbol || ''}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className='token-list-items'>
          {filteredAndSortedTokens.map(([key, token]) => (
            <div
              className={`token-list-item ${key} ${
                buyToken === key || sellToken === key ? 'disable' : ''
              }`}
              key={key}
              onClick={() => {
                if (type === 'sellToken') handleSellTokenChange(key);
                if (type === 'buyToken') handleBuyTokenChange(key);
                handleShowTokenList(false);
              }}>
              <div className='token-list-item-image'>
                <img
                  src={token?.logo_uri || '/default-image.png'}
                  alt={token?.name || 'token'}
                  width={36}
                  height={36}
                  style={{objectFit: 'contain', borderRadius: '50%'}}
                  loading='lazy'
                />
              </div>
              <div className='token-list-row-sb'>
                <div className='token-list-col'>
                  <div className='token-list-item-text-name'>
                    {token?.symbol || ''}
                  </div>
                  <div className='token-list-item-text-symbol'>
                    {token?.name || ''}
                  </div>
                </div>
                <div className='token-list-col-right'>
                  <div className='token-list-item-text-name'>
                    {account && token?.dollarValue
                      ? `$${token.dollarValue}`
                      : ''}
                  </div>
                  <div className='token-list-item-text-symbol'>
                    {token?.balance || ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TokenList;
