import { create } from 'zustand'
import type { Appliance } from '../types'

interface LoadState {
  appliances: Appliance[]
  addAppliance: (a: Appliance) => void
  updateAppliance: (id: string, patch: Partial<Appliance>) => void
  removeAppliance: (id: string) => void
  totalDailyWh: () => number
}

export const useLoadStore = create<LoadState>((set, get) => ({
  appliances: [],
  addAppliance: (a) => set((s) => ({ appliances: [...s.appliances, a] })),
  updateAppliance: (id, patch) =>
    set((s) => ({
      appliances: s.appliances.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })),
  removeAppliance: (id) =>
    set((s) => ({ appliances: s.appliances.filter((a) => a.id !== id) })),
  totalDailyWh: () =>
    get().appliances.reduce((sum, a) => sum + a.watts * a.hoursPerDay * a.quantity, 0),
}))