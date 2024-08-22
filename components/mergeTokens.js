import {ETH_TOKENS} from './lib/constants';
import {BASE_TOKENS} from './lib/constants';

function mergeTokens(chainId) {
  let customTokens = {};
  /*   if (typeof window !== 'undefined' && window.localStorage) {
    try {
      customTokens = JSON.parse(localStorage.getItem('customTokens')) || {};
    } catch (error) {
      console.error('Error parsing custom tokens from localStorage', error);
    }
  } */

  const mergedTokens = {};
  if (chainId === 1) {
    Object.keys(ETH_TOKENS).forEach((key) => {
      if (ETH_TOKENS[key].chainId === chainId) {
        mergedTokens[key] = ETH_TOKENS[key];
      }
    });
  }
  if (chainId === 8453) {
    Object.keys(BASE_TOKENS).forEach((key) => {
      if (BASE_TOKENS[key].chainId === chainId) {
        mergedTokens[key] = BASE_TOKENS[key];
      }
    });
  }

  Object.keys(customTokens).forEach((key) => {
    if (customTokens[key].chainId === chainId && !mergedTokens[key]) {
      mergedTokens[key] = customTokens[key];
    }
  });

  return mergedTokens;
}
export default mergeTokens;
