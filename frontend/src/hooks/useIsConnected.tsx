import { backendIsConnected } from '@/queries/backendIsConnected';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';


export function useIsConnected() {
    const { address, chainId } = useAccount();

    return useQuery<boolean>({
        enabled: !!address && !!chainId,
        queryKey: ['isConnected', address, chainId],
        queryFn: async () => {
            if (!address || !chainId) {
                throw new Error("Unreachable, no account connected");
            }
            const connection = await backendIsConnected({ address, chainId });
            return connection.responseObject
        },
    });
}