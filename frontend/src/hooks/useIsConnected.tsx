import { backendIsConnected } from '@/queries/backendIsConnected';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';


export function useIsConnected() {
    const { address } = useAccount();

    return useQuery<boolean>({
        enabled: !!address,
        queryKey: ['isConnected', address],
        queryFn: async () => {
            if (!address) {
                throw new Error("Unreachable, no account connected");
            }
            const connection = await backendIsConnected(address);
            return connection.responseObject
        },
    });
}