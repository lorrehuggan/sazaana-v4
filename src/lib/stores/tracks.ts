
import { AlbumWithAudioFeatures } from '@/types/index'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type initialState = {
  tracks: AlbumWithAudioFeatures[]
  trackID: string
  trackName: string
}

export type Actions = {
  add: (track: AlbumWithAudioFeatures) => void
  remove: (id: string) => void
  clear: () => void
  set: (tracks: AlbumWithAudioFeatures[]) => void
  setID: (id: string) => void
  removeID: () => void
  setName: (name: string) => void
  removeName: () => void
}

export const useCurrentTracks = create<initialState & Actions>()(
  persist((set, get) => ({
    tracks: [],
    add: (track: AlbumWithAudioFeatures) => set(state => ({ tracks: [...state.tracks, track] })),
    remove: (id: string) => set(state => ({ tracks: state.tracks.filter(track => track.id !== id) })),
    clear: () => set({ tracks: [], trackID: '', trackName: '' }),
    set: (tracks: AlbumWithAudioFeatures[]) => set({ tracks }),
    trackID: '',
    setID: (id: string) => set({ trackID: id }),
    removeID: () => set({ trackID: '' }),
    trackName: '',
    setName: (name: string) => set({ trackName: name }),
    removeName: () => set({ trackName: '' }),
  }), {
    name: 'currentTracks',
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
  })
)
