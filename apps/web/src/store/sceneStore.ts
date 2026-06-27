import { create } from 'zustand'
import type { ComponentModelType } from '../types'

export interface PlacedComponent {
  id: string
  type: ComponentModelType
  position: [number, number, number]
  rotation: [number, number, number]
}

export interface Wire {
  id: string
  fromId: string
  toId: string
}

interface SceneState {
  components: PlacedComponent[]
  wires: Wire[]
  selectedId: string | null
  addComponent: (c: PlacedComponent) => void
  removeComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  addWire: (fromId: string, toId: string) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  components: [],
  wires: [],
  selectedId: null,
  addComponent: (c) =>
    set((s) => ({ components: [...s.components, c] })),
  removeComponent: (id) =>
    set((s) => ({
      components: s.components.filter((c) => c.id !== id),
      wires: s.wires.filter((w) => w.fromId !== id && w.toId !== id),
    })),
  selectComponent: (id) => set({ selectedId: id }),
  addWire: (fromId, toId) =>
    set((s) => ({
      wires: [...s.wires, { id: crypto.randomUUID(), fromId, toId }],
    })),
}))