import { queryClient } from '@/app/providers';
import { backendAccountCreation } from '@/mutations/backendAccountCreation';
import { backendAccountDelete } from '@/mutations/backendAccountDelete';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export interface AccountCreationArguments {
  signature: `0x${string}`;
}

export function useAccountCreation() {
  const { address, chainId } = useAccount();

  return useMutation<void, Error, AccountCreationArguments>({
    mutationFn: async ({ signature }: AccountCreationArguments) => {
      if (!address || !chainId) {
        throw new Error('Unreachable, no account connected');
      }
      await backendAccountCreation({ address, signature, chainId });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalances'] });
      queryClient.invalidateQueries({ queryKey: ['isConnected'] });
    },
  });
}

export interface AccountDeletionArguments {
  signature: `0x${string}`;
}

export function useAccountDelete() {
  const { address, chainId } = useAccount();

  return useMutation<boolean, Error, AccountCreationArguments>({
    mutationFn: async ({ signature }: AccountCreationArguments) => {
      if (!address || !chainId) {
        throw new Error('Unreachable, no account connected');
      }
      await backendAccountDelete({ address, signature, chainId });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalances'] });
      queryClient.invalidateQueries({ queryKey: ['isConnected'] });
    },
  });
}
