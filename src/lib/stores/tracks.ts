
import { AlbumWithAudioFeatures, TrackWithFeatures } from '@/types/index'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type initialState = {
  tracks: TrackWithFeatures[]
  trackID: string
  trackName: string
}

export type Actions = {
  add: (track: TrackWithFeatures) => void
  remove: (id: string) => void
  clear: () => void
  set: (tracks: TrackWithFeatures[]) => void
  setID: (id: string) => void
  removeID: () => void
  setName: (name: string) => void
  removeName: () => void
}

export const useCurrentTracks = create<initialState & Actions>()(
  persist((set, get) => ({
    tracks: [],
    add: (track: TrackWithFeatures) => set(state => ({ tracks: [...state.tracks, track] })),
    remove: (id: string) => set(state => ({ tracks: state.tracks.filter(track => track.id !== id) })),
    clear: () => set({ tracks: [], trackID: '', trackName: '' }),
    set: (tracks: TrackWithFeatures[]) => set({ tracks }),
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
