// import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useEffect, useContext, useState, useMemo} from 'react';
import {BlockchainContext} from './BlockchainContext';
import dynamic from 'next/dynamic';
import NavBar from './NavBar';
import FooterBar from './Footer';

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

  return (
    <>
      <div className='bg' />
      {!account && (
        <div className='load-container'>
          <NavBar />
          <div className='wrong-network-container'>
            <div className='wrong-network-text'>Please connect your wallet</div>
          </div>
          <div className='main-container'></div>
          <FooterBar />
        </div>
      )}

      {account && !authToken && (
        <div className='load-container'>
          <NavBar />

          <div className='wrong-network-container'>
            <div className='wrong-network-text'>
              Please sign a message to prove wallet ownership
              <AuthButton />
            </div>
          </div>
          <div className='main-container'></div>
          <FooterBar />
        </div>
      )}

      {account && authToken && tokensReady ? (
        <SwapNoSSR
          buyLink={buyLink}
          buyLinkKey={buyLinkKey}
          chain_id={chain_id}
          key={chain_id}
        />
      ) : (
        account &&
        authToken && (
          <div className='load-container'>
            <NavBar />

            <div className='loader loader11'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Layout;
