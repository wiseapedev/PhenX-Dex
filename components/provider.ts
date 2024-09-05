/* import {providers} from 'ethers';
import {useMemo} from 'react';
import {useClient} from 'wagmi';

export function clientToProvider(client: any): providers.Provider {
  const {chain, transport} = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === 'fallback') {
    return new providers.FallbackProvider(
      transport.transports.map(
        ({value}) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  }
  return new providers.JsonRpcProvider(transport.url, network);
}

export function useEthersProvider({
  chainId,
}: {chainId?: number} = {}): providers.Provider {
  const client = useClient({chainId});
  return useMemo(() => clientToProvider(client), [client]);
}
 */

/* import {FallbackProvider, JsonRpcProvider} from 'ethers';
import {useMemo} from 'react';
import type {Chain, Client, Transport} from 'viem';
import {type Config, useClient} from 'wagmi';

export function clientToProvider(client: any) {
  const {chain, transport} = client;
  const network: any = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback') {
    const providers: any[] = (transport.transports as any[]).map(
      ({value}: any) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }
  return new JsonRpcProvider(transport.url, network);
}

export function useEthersProvider({chainId}: {chainId?: number} = {}) {
  const client = useClient<Config>({chainId});
  return useMemo(() => clientToProvider(client), [client]);
}
 */
