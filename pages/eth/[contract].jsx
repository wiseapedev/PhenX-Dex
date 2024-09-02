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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []); // Dependencies array  if (!pageReady)
  const {signer, account, chain_id} = useContext(BlockchainContext);
  const provider = new ethers.JsonRpcProvider(CHAINS[1].rpcUrl);
  const router = useRouter();
  const {contract} = router.query;
  const [pageReady, setPageReady] = useState(false);
  const [buyLinkKey, setBuyLinkKey] = useState('pnx');
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

  function mergeTokens() {
    let customTokens = {};
    // Check if 'window' and 'localStorage' are defined to ensure this code runs only client-side
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        customTokens = JSON.parse(localStorage.getItem('customTokens')) || {};
      } catch (error) {
        console.error('Error parsing custom tokens from localStorage', error);
      }
    }

    const mergedTokens = {...ETH_TOKENS};

    Object.keys(customTokens).forEach((key) => {
      if (!mergedTokens[key]) {
        mergedTokens[key] = customTokens[key];
      }
    });

    return mergedTokens;
  }

  const ALL_TOKENS = mergeTokens();

  async function handleContractImport(value) {
    let buyLinkKey = 'pnx';
    if (value.length === 42) {
      try {
        const tokenContract = new ethers.Contract(value, erc20Abi, provider);
        const symbol = await tokenContract.symbol();
        const name = await tokenContract.name();
        const decimals = await tokenContract.decimals();
        const logo_uri = `https://i.ibb.co/PQjTqqW/phenxlogo-1.png`;
        const newToken = {
          chain_id: 1,
          name: name,
          symbol: symbol,
          address: value,
          decimals: typeof decimals === 'bigint' ? Number(decimals) : decimals,
          logo_uri: logo_uri,
        };

        try {
          if (!ALL_TOKENS[symbol.toLowerCase()]) {
            const customTokens =
              JSON.parse(localStorage.getItem('customTokens')) || {};
            customTokens[symbol.toLowerCase()] = newToken;
            localStorage.setItem('customTokens', JSON.stringify(customTokens));
            const lowerCaseSymbol = symbol.toLowerCase();
            buyLinkKey = lowerCaseSymbol;
          } else {
            console.warn(`Token ${symbol} already exists in ALL_TOKENS.`);
            buyLinkKey = symbol.toLowerCase();
          }
        } catch (error) {
          console.error('Failed to import token:', error);
          toast.error('Failed to import token');
        }
      } catch (error) {
        console.error('Failed to import token:', error);
        window.location.href = '/';
      } finally {
        setBuyLinkKey(buyLinkKey);
      }
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (router.isReady) {
        console.log('buylink', contract);
        if (contract) {
          await handleContractImport(contract);
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
          <div className='loading'>Loading...</div>
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
    <div className='whole-container'>
      <Layout buyLink={contract} buyLinkKey={buyLinkKey} />
    </div>
  );
}
