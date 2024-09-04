import {useEffect, useState, useContext} from 'react';
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import {BlockchainContext} from '../../components/BlockchainContext';
import {ETH_TOKENS} from '../../components/lib/constants';
import {ethers} from 'ethers';
import {erc20Abi} from 'viem';
import {CHAINS} from '../../components/lib/constants';
import {ConnectButton} from '@rainbow-me/rainbowkit';

export default function BuyContract() {
  /*   useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []); */
  const {signer, account, chain_id} = useContext(BlockchainContext);
  const provider = new ethers.JsonRpcProvider(CHAINS[1].rpcUrl);
  const router = useRouter();
  const {contract} = router.query;
  const [pageReady, setPageReady] = useState(false);
  const [buyLinkKey, setBuyLinkKey] = useState(3);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      if (router.isReady) {
        if (chain_id !== 1) {
          setWrongNetwork(true);
        } else {
          setWrongNetwork(false);
        }
      }
    };

    loadData();
  }, [router.isReady, chain_id]); // Dependencies array  if (!pageReady)

  useEffect(() => {
    const loadData = async () => {
      if (router.isReady) {
        console.log('buylink', contract);
        if (!wrongNetwork) {
          setPageReady(true);
        }
      }
    };

    loadData();
  }, [router.isReady, contract]); // Dependencies array  if (!pageReady)

  if (!pageReady) {
    return (
      <div className='whole-container'>
        <div className='flex-col'>
          <div className='loading'></div>
        </div>
      </div>
    );
  }
  if (wrongNetwork) {
    return (
      <div className='whole-container'>
        <div className='nav-container'>
          <div className='nav-left'>
            <img
              src={'https://i.ibb.co/X8WRs0B/Unidex-Ai-Logo.png'}
              alt={''}
              width={60}
              height={60}
              style={{objectFit: 'contain', borderRadius: '50%'}}
              loading='lazy'
            />{' '}
            <div className='logo-text mobhide'>UDX </div>
            {/*           <BannerAd />
             */}{' '}
          </div>
          <div className='nav-right'>
            {' '}
            <ConnectButton
              //  accountStatus={{smallScreen: 'avatar', largeScreen: 'avatar'}}
              //  chainStatus={{smallScreen: 'icon', largeScreen: 'icon'}}
              showBalance={{smallScreen: false, largeScreen: true}}
              label='Connect Wallet & Switch Network'
            />
          </div>
        </div>
        <div className='scale-switch'>
          <div className='quick-import-bar'>Please change network</div>

          <ConnectButton
            accountStatus={{smallScreen: 'none', largeScreen: 'none'}}
            //   chainStatus={{smallScreen: 'icon', largeScreen: 'icon'}}
            showBalance={{smallScreen: false, largeScreen: false}}
            label='Switch Network'
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout buyLink={contract} buyLinkKey={buyLinkKey} />
    </>
  );
}
