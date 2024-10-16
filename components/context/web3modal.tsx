'use client';

import {createWeb3Modal, defaultConfig} from '@web3modal/ethers/react';

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '0aef2c24e12ca37c7ee7ee5f5bd8f56e';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://ethereum-rpc.publicnode.com',
};

const baseChain = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://base-rpc.publicnode.com',
};

// 3. Create a metadata object
const metadata = {
  name: 'PhenX DEX',
  description:
    'Trading on the PhenX router saves you up to 16% on gas fees compared to the Uniswap router. While all DEXs charge a swap fee ranging from 0.25% to 1.5%, PhenX charges 0%. PhenX seamlessly aggregates liquidity, ensuring you always get the best price for your trades.',
  url: 'https://beta.phenx.xyz/', // origin must match your domain & subdomain
  icons: [
    'https://www.dextools.io/resources/tokens/logos/ether/0xd166b7d9824cc5359360b47389aba9341ce12619.png?1722864698511',
  ],
};

// 4. Create Ethers config
// Configure the Web3Modal to disable social logins
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true, // Enable Coinbase Wallet

  auth: {
    email: false, // Disable email login
    socials: [], // Disable social logins
    showWallets: true, // Only show wallets
  },
  coinbasePreference: 'all',
});
// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet, baseChain],
  projectId,
  enableSwaps: false,
  isSiweEnabled: false,
  isUniversalProvider: false,
});

export function AppKit({children}) {
  return children;
}
