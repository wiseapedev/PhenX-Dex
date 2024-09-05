import '../styles/globals.css';
import '../styles/oldCSS.css';
import '@rainbow-me/rainbowkit/styles.css';
import type {AppProps} from 'next/app';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {getChainId} from '@wagmi/core';
import {watchChainId} from '@wagmi/core';

import {WagmiProvider, createConfig, http} from 'wagmi';

import {
  arbitrum,
  base,
  mainnet,
  optimism,
  sepolia,
  goerli,
  zora,
} from 'wagmi/chains';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {BlockchainProvider} from '../components/BlockchainContext';
import {connectorsForWallets} from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  argentWallet,
  bifrostWallet,
  bitgetWallet,
  bitskiWallet,
  braveWallet,
  clvWallet,
  coin98Wallet,
  coreWallet,
  dawnWallet,
  desigWallet,
  enkryptWallet,
  foxWallet,
  frameWallet,
  frontierWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  mewWallet,
  oktoWallet,
  okxWallet,
  omniWallet,
  oneKeyWallet,
  phantomWallet,
  rabbyWallet,
  safeWallet,
  safeheronWallet,
  safepalWallet,
  subWallet,
  tahoWallet,
  talismanWallet,
  tokenaryWallet,
  tokenPocketWallet,
  trustWallet,
  uniswapWallet,
  xdefiWallet,
  zealWallet,
  zerionWallet,
} from '@rainbow-me/rainbowkit/wallets';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {useEffect, useState} from 'react';
import '@walletconnect/modal';
import React from 'react';
// import config from '../config/config';
import {AppKit} from './context/web3modal';
export const metadata = {
  title: 'AppKit',
  description: 'AppKit Example',
};
/* const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '0aef2c24e12ca37c7ee7ee5f5bd8f56e',
  chains: [
    mainnet,
         polygon,
    optimism,
    arbitrum,
    base,
    zora, 
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
}); */
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        ledgerWallet,
        safepalWallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        trustWallet,
        uniswapWallet,
        argentWallet,
        bifrostWallet,
        bitgetWallet,
        bitskiWallet,
        braveWallet,
        clvWallet,
        coin98Wallet,
        injectedWallet,
        coreWallet,
        dawnWallet,
        desigWallet,
        enkryptWallet,
        foxWallet,
        frameWallet,
        frontierWallet,
        imTokenWallet,
        ledgerWallet,
        metaMaskWallet,
        mewWallet,
        oktoWallet,
        okxWallet,
        omniWallet,
        oneKeyWallet,
        phantomWallet,
        rabbyWallet,
        safeWallet,
        safeheronWallet,
        subWallet,
        tahoWallet,
        talismanWallet,
        tokenaryWallet,
        tokenPocketWallet,
        xdefiWallet,
        zealWallet,
        zerionWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: 'PhenX',
    projectId: '0aef2c24e12ca37c7ee7ee5f5bd8f56e',
  }
);

const client = new QueryClient();

function MyApp({Component, pageProps}: AppProps) {
  /*   useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://phenx.xyz/';
    }
  }, []); */

  const [isMobile, setIsMobile] = useState(false);
  // This could be placed in a file that's executed in the Node.js environment,
  // such as next.config.js or a custom server setup.

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px as a threshold for mobile devices
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /*   function removeIntro() {
    const intro = document.querySelector('.intro-container') as HTMLElement;
    if (intro) {
      // Start the fade out
      intro.style.opacity = '0';

      // Wait for the transition to finish before removing the element.
      // The duration should match the CSS transition duration.
      setTimeout(() => {
        intro.remove();
      }, 4000);
    }
  }

  useEffect(() => {
    const removalTimer = setTimeout(() => {
      const intro = document.querySelector('.intro-container') as HTMLElement;
      if (intro && intro.parentNode) {
        intro.style.opacity = '0';
        setTimeout(() => {
          if (intro && intro.parentNode) {
            intro.remove();
          }
        }, 4000);
      }
    }, 5000);

    return () => {
      clearTimeout(removalTimer);
    };
  }, []);
  
  <div onClick={removeIntro} className='intro-container'>
  <div className='pre-container'>
    <div className='banner-container'>
      <div className='intro-banner' />
    </div>{' '}
    <div className='intro-box'>Discover the Ultimate All-in-One DEX</div>
    <div className='intro-box'>Seamless One-Click Trading & Imports</div>
    <div className='intro-box'>Unmatched Trading Speeds</div>
    <div className='intro-box'>Enjoy up to 50% Savings on Gas Fees</div>
    <div className='intro-box'>
      Backed by a Strong Network of 42 Partners
    </div>
    <div className='intro-box'>100% Revenue Share Model</div>
  </div>
</div> */
  /*   return (
    <WagmiProvider config={config}>
      <ToastContainer
        position='top-left'
        autoClose={2000} // Adjust the auto close delay as needed
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <QueryClientProvider client={client}>
        <RainbowKitProvider
          modalSize='compact'
          theme={darkTheme({
            accentColor: 'rgb(255, 165, 0)',
            accentColorForeground: 'black',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}>
          {' '}
          <BlockchainProvider config={config}>
            <Component {...pageProps} />
          </BlockchainProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
 */
  return (
    <AppKit>
      <ToastContainer
        position='top-left'
        autoClose={2000} // Adjust the auto close delay as needed
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />

      <BlockchainProvider>
        <Component {...pageProps} />
      </BlockchainProvider>
    </AppKit>
  );
}

export default MyApp;
