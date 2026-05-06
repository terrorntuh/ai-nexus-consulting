'use client';

import { create } from 'zustand';

interface PlainEnglishState {
    isPlain: boolean;
    togglePlain: () => void;
    setPlain: (val: boolean) => void;
}

export const usePlainEnglishStore = create<PlainEnglishState>((set) => ({
    isPlain: false,
    togglePlain: () => set((state) => ({ isPlain: !state.isPlain })),
    setPlain: (val) => set({ isPlain: val }),
}));

export function usePlainEnglish() {
    const { isPlain, togglePlain, setPlain } = usePlainEnglishStore();

    const t = (tech: string, plain: string) => (isPlain ? plain : tech);

    return { isPlain, togglePlain, setPlain, t };
}
