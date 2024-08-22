import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useEffect, useContext, useState} from 'react';
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
  const {config} = useContext(BlockchainContext);
  const [chainId, setChainId] = useState(getChainId(config));

  useEffect(() => {
    const unwatch = watchChainId(config, {
      onChange(newChainId) {
        console.log('Chain ID changed!', newChainId);
        setChainId(newChainId); // This will trigger a remount of SwapNoSSR if keyed by chainId
      },
    });

    return () => unwatch();
  }, [config]);

  return (
    <div>
      <SwapNoSSR
        key={chainId} // Using chainId as key to force remount on change
        buyLink={buyLink}
        buyLinkKey={buyLinkKey}
        chainId={chainId}
      />
    </div>
  );
};

export default Layout;
