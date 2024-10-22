import '../styles/globals.css';
import '../styles/oldCSS.css';
import '../styles/stake.css';
import '../styles/loader.css';

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught in ErrorBoundary: ', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }

    return this.props.children;
  }
}

function MyApp({Component, pageProps}: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  function LoadingScreen() {
    return (
      <div className='load-container'>
        <div className='bg'>
          {' '}
          <div className='loader loader11'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>{' '}
        </div>

        <div className='main-container'></div>
      </div>
    );
  }
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default MyApp;
