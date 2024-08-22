import {useWeb3React} from '@web3-react/core';
import {Network} from '@web3-react/network';
import {ConnectionType} from 'connection';
import {getConnection} from 'connection/utils';
import {useEffect, useState} from 'react';

// Define the MEV RPC URL
const MEV_RPC_URL = 'https://rpc.flashbots.net';

// Initialize the Network connector
const network = new Network({urlMap: {1: MEV_RPC_URL}, defaultChainId: 1});

const AntiMevButton = () => {
  const {activate, account, provider: library} = useWeb3React();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (library && account) {
    } else {
    }
  }, [library, account]);

  const connectToFlashbots = async () => {
    setLoading(true);
    try {
      const networkConnection = getConnection(ConnectionType.NETWORK);
      await activate(networkConnection.connector);
    } catch (error) {
      console.error('➡️ Failed to connect to Flashbots', error);
    } finally {
      setLoading(false);
    }
  };
  if (!library || !account) {
    return null; // Do not render if library or account is not available
  }

  const currentRpcUrl = library?.provider?.url;
  if (currentRpcUrl === MEV_RPC_URL) {
    return null; // Do not render if already connected to the desired RPC URL
  }

  return (
    <div className='Mev-Button' onClick={connectToFlashbots} disabled={loading}>
      {loading ? 'Connecting...' : 'Connect to MEV'}
    </div>
  );
};

export default AntiMevButton;
