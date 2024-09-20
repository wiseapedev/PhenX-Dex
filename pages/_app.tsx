import '../styles/globals.css';
import '../styles/oldCSS.css';
import '../styles/stake.css';

// import '@rainbow-me/rainbowkit/styles.css';
import type {AppProps} from 'next/app';
import {StakeProvider} from '../stake-page/StakeContext';

import {BlockchainProvider} from '../components/BlockchainContext';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {useEffect, useState} from 'react';
import React from 'react';
// import config from '../config/config';
import {AppKit} from '../components/context/web3modal';
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

function MyApp({Component, pageProps}: AppProps) {
  /*   useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }, []); */
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
        <StakeProvider>
          <Component {...pageProps} />
        </StakeProvider>
      </BlockchainProvider>
    </AppKit>
  );
}

export default MyApp;
