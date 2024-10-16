// import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useEffect, useContext, useState, useMemo} from 'react';
import {BlockchainContext} from './BlockchainContext';
import dynamic from 'next/dynamic';
import NavBar from './NavBar';
import FooterBar from './Footer';

const SwapNoSSR = dynamic(() => import('./Swap'), {
  ssr: false, // This will disable server-side rendering for the Swap component
});

const Layout = ({buyLink, buyLinkKey}) => {
  const {chain_id, ETH_TOKENS, ALL_TOKENS, account, AuthButton, authToken} =
    useContext(BlockchainContext);
  const [tokensReady, setTokensReady] = useState(false);
  const [stateChanged, setStateChanged] = useState(1);

  // Polling logic for account and authToken every 5 seconds
  /*   useEffect(() => {
    const interval = setInterval(() => {
      if (account && authToken) {
        setStateChanged((prev) => prev + 1);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, [account, authToken]);

 */ useEffect(() => {
    setTokensReady(false);
  }, [chain_id]);

  useEffect(() => {
    if (
      ETH_TOKENS &&
      ALL_TOKENS &&
      Object.keys(ETH_TOKENS).length > 0 &&
      Object.keys(ALL_TOKENS).length > 0 &&
      authToken
    ) {
      setTimeout(() => {
        setTokensReady(true);
      }, 500);
    }
  }, [ETH_TOKENS, ALL_TOKENS, chain_id, authToken, account]);

  const memoNavBar = useMemo(() => <NavBar />, [account]);

  if (!account) {
    return (
      <div className='load-container'>
        {memoNavBar}
        <div className='bg' />
        <div className='wrong-network-container'>
          <div className='wrong-network-text'>Please connect your wallet</div>
        </div>
        <div className='main-container'></div>
        <FooterBar />
      </div>
    );
  } else if (!authToken && account) {
    return (
      <div className='load-container'>
        {memoNavBar}
        <div className='bg' />
        <div className='wrong-network-container'>
          <div className='wrong-network-text'>
            Please sign a message to prove wallet ownership
            <AuthButton />
          </div>
        </div>
        <div className='main-container'></div>
        <FooterBar />
      </div>
    );
  }

  return (
    <>
      {tokensReady ? (
        <SwapNoSSR
          buyLink={buyLink}
          buyLinkKey={buyLinkKey}
          chain_id={chain_id}
          key={chain_id}
        />
      ) : (
        <div className='load-container'>
          {memoNavBar}
          <div className='bg'>
            <div className='loader loader11'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className='main-container'></div>
          <FooterBar />
        </div>
      )}
    </>
  );
};

export default Layout;
