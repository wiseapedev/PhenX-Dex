/* import {useMemo} from 'react';
import {providers} from 'ethers';
import {useConnectorClient} from 'wagmi';

export function clientToSigner(client: any): any {
  const {account, chain, transport} = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport as any, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function useEthersSigner({chainId}: {chainId?: number} = {}): any {
  const {data: client} = useConnectorClient({chainId});
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
 */
import {BrowserProvider, JsonRpcSigner} from 'ethers';
import {useMemo} from 'react';
import type {Account, Chain, Client, Transport} from 'viem';
import {type Config, useConnectorClient} from 'wagmi';

export function clientToSigner(client: any) {
  const {account, chain, transport} = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({chainId}: {chainId?: number} = {}) {
  const {data: client} = useConnectorClient<Config>({chainId});
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
