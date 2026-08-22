import { create } from 'zustand'
import type { ComponentModelType } from '../types'

export interface PlacedComponent {
  id: string
  type: ComponentModelType
  position: [number, number, number]
  rotation: [number, number, number]
  notes: string
}

export type WireType = 'positive' | 'negative'

export interface Wire {
  id: string
  fromId: string
  toId: string
  wireType: WireType
}

interface SceneState {
  components: PlacedComponent[]
  wires: Wire[]
  selectedId: string | null
  sceneNotes: string
  addComponent: (c: PlacedComponent) => void
  moveComponent: (id: string, pos: [number, number, number]) => void
  rotateComponent: (id: string, rot: [number, number, number]) => void
  removeComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  addWire: (fromId: string, toId: string, wireType: WireType) => void
  updateComponentNotes: (id: string, notes: string) => void
  updateSceneNotes: (notes: string) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  components: [],
  wires: [],
  selectedId: null,
  sceneNotes: '',
  addComponent: (c) =>
    set((s) => ({ components: [...s.components, c] })),
  moveComponent: (id, pos) =>
    set((s) => ({
      components: s.components.map((c) =>
        c.id === id ? { ...c, position: pos } : c
      ),
    })),
  rotateComponent: (id, rot) =>
    set((s) => ({
      components: s.components.map((c) =>
        c.id === id ? { ...c, rotation: rot } : c
      ),
    })),
  removeComponent: (id) =>
    set((s) => ({
      components: s.components.filter((c) => c.id !== id),
      wires: s.wires.filter((w) => w.fromId !== id && w.toId !== id),
    })),
  selectComponent: (id) => set({ selectedId: id }),
  addWire: (fromId, toId, wireType) =>
    set((s) => ({
      wires: [...s.wires, { id: crypto.randomUUID(), fromId, toId, wireType }],
    })),
  updateComponentNotes: (id, notes) =>
    set((s) => ({
      components: s.components.map((c) =>
        c.id === id ? { ...c, notes } : c
      ),
    })),
  updateSceneNotes: (notes) => set({ sceneNotes: notes }),
}))