
import { backendAccountCreation } from '@/queries/backendAccountCreation';
import { backendTokenBalances } from '@/queries/backenTokenBalance';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';


export function useAccountCreation({ signature }: { signature: `0x${string}` | null }) {
    const { address } = useAccount();

    return useQuery<boolean>({
        enabled: !!address && !!signature,
        queryKey: ['tokenBalances', address],
        queryFn: async () => {

            if (!address) {
                throw new Error("Unreachable, no account connected");
            }
            if (!signature) {
                throw new Error("Unreachable, ownership message not signed");
            }
            await backendAccountCreation(address, signature);
            return true
        },
    });
}