import {BASE_TOKENS} from './lib/constants';

function normalizeTokenProperties(token) {
  return {
    id: token.id || null,
    is_partner: token.isPartner || token.is_partner || false,
    is_v2: token.isV2 || token.is_v2 || false,
    chain_id: token.chainId || token.chain_id || null,
    name: token.name || '',
    symbol: token.symbol || '',
    decimals: token.decimals || null,
    address: token.address || '',
    logo_uri: token.logoURI || token.logo_uri || '',
  };
}

function mergeTokens(chain_id, ETH_TOKENS) {
  let customTokens = {};

  // Retrieve custom tokens from localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      customTokens = JSON.parse(localStorage.getItem('customTokens')) || {};

      // Normalize custom tokens
      Object.keys(customTokens).forEach((key) => {
        customTokens[key] = normalizeTokenProperties(customTokens[key]);
      });
    } catch (error) {
      console.error('Error parsing custom tokens from localStorage', error);
    }
  }

  const mergedTokens = {};
  let maxId = 0;

  // Merge tokens from ETH_TOKENS for Ethereum (chain_id: 1)
  if (chain_id === 1) {
    Object.keys(ETH_TOKENS).forEach((key) => {
      const token = ETH_TOKENS[key];
      if (token.chain_id === chain_id) {
        mergedTokens[token.id] = token;
        // Track the highest ID
        maxId = Math.max(maxId, token.id || 0);
      }
    });
  }
  if (chain_id === 8453) {
    Object.keys(ETH_TOKENS).forEach((key) => {
      const token = ETH_TOKENS[key];
      if (token.chain_id === chain_id) {
        mergedTokens[token.id] = token;
        // Track the highest ID
        maxId = Math.max(maxId, token.id || 0);
      }
    });
  }
  if (chain_id === 56) {
    Object.keys(ETH_TOKENS).forEach((key) => {
      const token = ETH_TOKENS[key];
      if (token.chain_id === chain_id) {
        mergedTokens[token.id] = token;
        // Track the highest ID
        maxId = Math.max(maxId, token.id || 0);
      }
    });
  }

  // Merge tokens from BASE_TOKENS for another chain (chain_id: 8453)
  /*   if (chain_id === 8453) {
    Object.keys(BASE_TOKENS).forEach((key) => {
      const token = BASE_TOKENS[key];
      if (token.chain_id === chain_id) {
        mergedTokens[token.id] = token;
        maxId = Math.max(maxId, token.id || 0);
      }
    });
  } */

  // Assign new unique IDs to custom tokens and merge them
  /*   Object.keys(customTokens).forEach((key) => {
    const token = customTokens[key];
    // custom token symbol not match mergetoken symbol
     
    if (token.chain_id === chain_id) {
      // If the custom token doesn't have an ID, assign one
      if (!token.id) {
        maxId += 1;
        token.id = maxId;
      }
      mergedTokens[token.id] = token;
    }
  }); */
  Object.keys(customTokens).forEach((key) => {
    const token = customTokens[key];

    // Check if symbol or contract address matches any in mergedTokens
    const isDuplicate = Object.values(mergedTokens).some(
      (mergedToken) =>
        mergedToken.symbol === token.symbol ||
        mergedToken.contractAddress === token.contractAddress
    );

    // Skip adding if there's a match by symbol or contract address
    if (token.chain_id === chain_id && !isDuplicate) {
      // If the custom token doesn't have an ID, assign one
      if (!token.id) {
        maxId += 1;
        token.id = maxId;
      }
      mergedTokens[token.id] = token;
    }
  });

  return mergedTokens;
}

export default mergeTokens;
