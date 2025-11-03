import { sign } from 'crypto';
import { get } from 'http'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


export interface SignatureParams {
    address: `0x${string}`;
    chainId: number;
}

interface OwnershipSignatureState {
    signatures: Record<number, Record<`0x${string}`, `0x${string}`>>;
    addSignature: (params: SignatureParams, newSignature: `0x${string}`) => void;
    getSignature: (params: SignatureParams) => `0x${string}` | null;
}

export const useOwnershipSignature = create<OwnershipSignatureState>()(persist(
    (set, get) => ({
        signatures: {},
        addSignature: (params: SignatureParams, newSignature) => set({
            signatures: {
                ...get().signatures,
                [params.chainId]: {
                    ...(get().signatures[params.chainId] || {}),
                    [params.address]: newSignature
                }
            }
        }),
        getSignature: (params: SignatureParams) => {
            const { signatures } = get();
            return signatures[params.chainId]?.[params.address] || null;
        }
    }),
    {
        name: 'ownership-signature-storage',
        storage: createJSONStorage(() => localStorage),
    },
)
)



