// import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useEffect, useContext, useState, useMemo, useRef} from 'react';
import {BlockchainContext} from './BlockchainContext';
import dynamic from 'next/dynamic';
import NavBar from './NavBar';
import Loader from './Loader';
import FooterBar from './Footer';
import {ETH_TOKENS_DISPLAY} from './lib/constants';

const SwapNoSSR = dynamic(() => import('./Swap'), {
  ssr: false, // Disable server-side rendering for the Swap component
});

const Layout = ({buyLink, buyLinkKey}) => {
  const {chain_id, ETH_TOKENS, ALL_TOKENS, account, AuthButton, authToken} =
    useContext(BlockchainContext);
  const [tokensReady, setTokensReady] = useState(false);

  useEffect(() => {
    setTokensReady(false); // Reset tokensReady on chain_id change
  }, [chain_id]);

  useEffect(() => {
    if (
      ETH_TOKENS &&
      ALL_TOKENS &&
      Object.keys(ETH_TOKENS).length > 0 &&
      Object.keys(ALL_TOKENS).length > 0 &&
      authToken
    ) {
      setTimeout(() => setTokensReady(true), 500); // Small delay for smooth rendering
    }
  }, [ETH_TOKENS, ALL_TOKENS, chain_id, authToken, account]);

  const memoNavBar = useMemo(() => <NavBar />, [account]);
  const memoFooterBar = useMemo(() => <FooterBar />, [account]);

  function WrongNetwork() {
    const containerRef = useRef(null);

    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        container.style.opacity = '0';
        setTimeout(() => {
          container.style.transition = 'opacity 1s ease';
          container.style.opacity = '1';
        }, 100); // delay to ensure the opacity change is noticed
      }
    }, []);

    return (
      <div className='load-container' ref={containerRef}>
        <div className='wrong-network-container'>
          <div className='wrong-network-text'>Please connect your wallet</div>
        </div>
        <div className='main-container'></div>
      </div>
    );
  }

  return (
    <div className='whole-container'>
      {memoNavBar}
      <div className='bg' />

      {/*       {!account && <WrongNetwork />}
       */}
      {!account && (
        <SwapNoSSR
          buyLink={buyLink}
          buyLinkKey={buyLinkKey}
          chain_id={chain_id}
          key={chain_id}
          ALL_TOKENS={ETH_TOKENS_DISPLAY}
        />
      )}
      {account && authToken && tokensReady ? (
        <SwapNoSSR
          buyLink={buyLink}
          buyLinkKey={buyLinkKey}
          chain_id={chain_id}
          key={chain_id}
          ALL_TOKENS={ALL_TOKENS}
        />
      ) : (
        account && authToken && <Loader />
      )}

      {memoFooterBar}
    </div>
  );
};

export default Layout;
