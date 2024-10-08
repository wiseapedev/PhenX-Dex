// import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useEffect, useContext, useState, useMemo} from 'react';
import {ethers} from 'ethers';
import {BlockchainContext} from './BlockchainContext';
import Swap from './Swap';
import dynamic from 'next/dynamic';
import NavBar from './NavBar';
import FooterBar from './Footer';

const SwapNoSSR = dynamic(() => import('./Swap'), {
  ssr: false, // This will disable server-side rendering for the Swap component
});

const Layout = ({buyLink, buyLinkKey}) => {
  const {chain_id, ETH_TOKENS, ALL_TOKENS, account} =
    useContext(BlockchainContext);
  const [tokensReady, setTokensReady] = useState(false);

  useEffect(() => {
    setTokensReady(false);
  }, [chain_id]);

  useEffect(() => {
    if (
      ETH_TOKENS &&
      ALL_TOKENS &&
      Object.keys(ETH_TOKENS).length > 0 &&
      Object.keys(ALL_TOKENS).length > 0
    ) {
      setTimeout(() => {
        setTokensReady(true);
      }, 500);
    }
  }, [ETH_TOKENS, ALL_TOKENS, chain_id]);

  /*   useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(newChainId) {
        console.log('Chain ID changed!', newChainId);
        setChainId(newChainId); // This will trigger a remount of SwapNoSSR if keyed by chain_id
      },
    });
https://beta.phenx.xyz/
    return () => unwatch();
  }, [config]);
 */
  const memoNavBar = useMemo(() => <NavBar />, [account]);

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
            {' '}
            <div className='loader loader11'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>{' '}
          </div>

          <div className='main-container'></div>
          <FooterBar />
        </div>
      )}
    </>
  );
};

export default Layout;
