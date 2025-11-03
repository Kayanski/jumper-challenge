
import { queryClient } from '@/app/providers';
import { backendAccountCreation } from '@/queries/backendAccountCreation';
import { backendAccountDelete } from '@/queries/backendAccountDelete';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';


export interface AccountCreationArguments {
    signature: `0x${string}`
}

export function useAccountCreation() {
    const { address } = useAccount();

    return useMutation<boolean, Error, AccountCreationArguments>({
        mutationFn: async ({ signature }: AccountCreationArguments) => {
            if (!address) {
                throw new Error("Unreachable, no account connected");
            }
            return await backendAccountCreation(address, signature);
            return true
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokenBalances'] })
            queryClient.invalidateQueries({ queryKey: ['isConnected'] })
        }
    });
}


export interface AccountDeletionArguments {
    signature: `0x${string}`
}

export function useAccountDelete() {
    const { address } = useAccount();

    return useMutation<boolean, Error, AccountCreationArguments>({
        mutationFn: async ({ signature }: AccountCreationArguments) => {

            if (!address) {
                throw new Error("Unreachable, no account connected");
            }
            await backendAccountDelete(address, signature);
            return true
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tokenBalances'] })
            queryClient.invalidateQueries({ queryKey: ['isConnected'] })
        }
    });
}