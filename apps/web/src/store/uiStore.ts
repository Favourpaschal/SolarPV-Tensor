import { create } from 'zustand'
import type { UIMode } from '../types'

interface UIState {
  mode: UIMode
  wizardStep: number
  compareIds: string[]
  setMode: (m: UIMode) => void
  nextStep: () => void
  prevStep: () => void
  toggleCompare: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  mode: 'hobbyist',
  wizardStep: 0,
  compareIds: [],
  setMode: (m) => set({ mode: m, wizardStep: 0 }),
  nextStep: () => set((s) => ({ wizardStep: s.wizardStep + 1 })),
  prevStep: () => set((s) => ({ wizardStep: Math.max(0, s.wizardStep - 1) })),
  toggleCompare: (id) =>
    set((s) => ({
      compareIds: s.compareIds.includes(id)
        ? s.compareIds.filter((c) => c !== id)
        : [...s.compareIds, id].slice(-3),
    })),
}))