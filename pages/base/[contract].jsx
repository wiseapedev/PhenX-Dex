'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import {ethers} from 'ethers';
import {CHAINS} from '../../components/lib/constants';

export default function BuyContract() {
  const chain_id = 1;
  const router = useRouter();
  const {contract} = router.query;
  const [pageReady, setPageReady] = useState(false);
  const [buyLinkKey, setBuyLinkKey] = useState(3);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  // Set up  in useEffect to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ethersProvider = new ethers.JsonRpcProvider(CHAINS[1].rpcUrl);
      setProvider(ethersProvider);
    }
  }, []); // Empty dependency array to run only on component mount

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
  }, [router.isReady, chain_id]); // Dependencies array updated to include

  useEffect(() => {
    const loadData = async () => {
      if (router.isReady && !wrongNetwork) {
        console.log('buylink', contract);
        setPageReady(true);
      }
    };

    loadData();
  }, [router.isReady, contract, wrongNetwork]); // Dependencies array updated

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
            />
            <div className='logo-text mobhide'>UDX </div>
          </div>
        </div>
        <div className='scale-switch'>
          <div className='quick-import-bar'>Please change network</div>
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
