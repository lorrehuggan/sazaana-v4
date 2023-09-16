import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type initialState = {
  open: boolean
}

export type Actions = {
  toggle: () => void
  set: (open: boolean) => void
}

export const useCurrentQuery = create<initialState & Actions>()(
  (set, get) => ({
    open: false,
    toggle: () => set(state => ({ open: !state.open })),
    set: (open: boolean) => set({ open }),
  })
)
