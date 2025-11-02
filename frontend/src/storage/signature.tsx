import { get } from 'http'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


interface OwnershipSignatureState {
    signature: `0x${string}` | null;
    setSignature: (newSignature: `0x${string}`) => void;
    getSignature: () => `0x${string}` | null;
}

export const useOwnershipSignature = create<OwnershipSignatureState>()(persist(
    (set, get) => ({
        signature: null,
        setSignature: (newSignature: `0x${string}`) => set({ signature: newSignature }),
        getSignature: () => get().signature,
    }),
    {
        name: 'ownership-signature-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
)
)



