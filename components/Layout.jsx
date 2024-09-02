import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useEffect, useContext, useState, use} from 'react';
import {ethers} from 'ethers';
import {BlockchainContext} from './BlockchainContext';
import Swap from './Swap';
import dynamic from 'next/dynamic';
import {watchChainId} from '@wagmi/core';
import {getChainId} from '@wagmi/core';

const SwapNoSSR = dynamic(() => import('./Swap'), {
  ssr: false, // This will disable server-side rendering for the Swap component
});

const Layout = ({buyLink, buyLinkKey}) => {
  const {config, ETH_TOKENS, ALL_TOKENS} = useContext(BlockchainContext);
  const [chain_id, setChainId] = useState(getChainId(config));
  const [tokensReady, setTokensReady] = useState(false);
  useEffect(() => {
    if (
      Object.keys(ETH_TOKENS).length > 0 &&
      Object.keys(ALL_TOKENS).length > 0
    ) {
      console.log('ETH_TOKENS:', ETH_TOKENS);
      console.log('ALL_TOKENS:', ALL_TOKENS);
      setTokensReady(true);
    }
  }, [ETH_TOKENS, ALL_TOKENS]);

  useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(newChainId) {
        console.log('Chain ID changed!', newChainId);
        setChainId(newChainId); // This will trigger a remount of SwapNoSSR if keyed by chain_id
      },
    });

    return () => unwatch();
  }, [config]);

  return (
    <div>
      {tokensReady ? (
        <SwapNoSSR
          key={chain_id} // Using chain_id as key to force remount on change
          buyLink={buyLink}
          buyLinkKey={buyLinkKey}
          chain_id={chain_id}
        />
      ) : (
        <div className='whole-container'>
          <div className='bg' />

          <div className='main-container'>
            <div className='loader'></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
