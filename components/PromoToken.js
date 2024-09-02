/* eslint-disable @next/next/no-img-element */
import React, {useState, useEffect} from 'react';
import {ETH_TOKENS, BASE_TOKENS} from './lib/constants';

function PromoToken({handleBuyTokenChange, chain_id}) {
  const [tokens, setTokens] = useState([]);
  const [offset, setOffset] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // Track the active index

  useEffect(() => {
    let selectedTokens = [];
    if (chain_id === 1) {
      selectedTokens = Object.values(ETH_TOKENS).filter(
        (token) => token.isPromo
      );
    } else if (chain_id === 8453) {
      selectedTokens = Object.values(BASE_TOKENS).filter(
        (token) => token.isPromo
      );
    }
    setTokens(selectedTokens);
    setOffset(0); // Reset the offset with new tokens
    setActiveIndex(0); // Reset active index
  }, [chain_id]);

  useEffect(() => {
    if (tokens.length === 0) return undefined;

    const interval = setInterval(() => {
      setOffset((current) => {
        const newOffset =
          current <= -100 * (tokens.length - 1) ? 0 : current - 100;
        // Update active index based on the offset
        const newIndex =
          newOffset === 0 ? 0 : (activeIndex + 1) % tokens.length;
        setActiveIndex(newIndex);
        return newOffset;
      });
    }, 5000); // Rotate tokens every 3 seconds
    return () => clearInterval(interval);
  }, [tokens, activeIndex]);

  if (tokens.length === 0) {
    return null;
  }

  return (
    <div className='promo-container'>
      <div className='promo-tokens-section'>
        <div
          className='promo-tokens'
          style={{transform: `translateX(${offset}%)`}}>
          {tokens.concat(tokens[0]).map((token, index) => (
            <div
              className={`token-item ${
                index === activeIndex ? 'token-active' : ''
              }`}
              key={index}
              onClick={() => handleBuyTokenChange(token.symbol.toLowerCase())}>
              <img
                src={token.logo_uri}
                alt={token.name}
                width={34}
                height={34}
                style={{objectFit: 'contain', borderRadius: '50%'}}
              />
              <div className='base-symbol'>{token.symbol}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromoToken;
