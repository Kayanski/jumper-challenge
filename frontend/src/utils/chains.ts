import * as chains from 'viem/chains';

export function getChainById(chainId: number) {
  return Object.values(chains).find((chain) => chain.id === chainId);
}
