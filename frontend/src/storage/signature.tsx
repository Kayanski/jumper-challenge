import { get } from 'http'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


interface OwnershipSignatureState {
    signature: `0x${string}` | null;
    address: `0x${string}` | null;
    setSignature: (newSignature: `0x${string}`, address: `0x${string}`) => void;
    getSignature: (address: `0x${string}`) => `0x${string}` | null;
}

export const useOwnershipSignature = create<OwnershipSignatureState>()(persist(
    (set, get) => ({
        signature: null,
        address: null,
        setSignature: (newSignature: `0x${string}`, address: `0x${string}`) => set({ signature: newSignature, address }),
        getSignature: (address: `0x${string}`) => {
            const { signature, address: storedAddress } = get();
            if (storedAddress === address) {
                return signature;
            }
            return null;
        }
    }),
    {
        name: 'ownership-signature-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
)
)



