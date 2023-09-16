
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type initialState = {
  tracks: Spotify.TrackObjectFull[]
  trackID: string
  trackName: string
}

export type Actions = {
  add: (track: Spotify.TrackObjectFull) => void
  remove: (id: string) => void
  clear: () => void
  set: (tracks: Spotify.TrackObjectFull[]) => void
  setID: (id: string) => void
  removeID: () => void
  setName: (name: string) => void
  removeName: () => void
}

export const useCurrentTracks = create<initialState & Actions>()(
  persist((set, get) => ({
    tracks: [],
    add: (track: Spotify.TrackObjectFull) => set(state => ({ tracks: [...state.tracks, track] })),
    remove: (id: string) => set(state => ({ tracks: state.tracks.filter(track => track.id !== id) })),
    clear: () => set({ tracks: [], trackID: '', trackName: '' }),
    set: (tracks: Spotify.TrackObjectFull[]) => set({ tracks }),
    trackID: '',
    setID: (id: string) => set({ trackID: id }),
    removeID: () => set({ trackID: '' }),
    trackName: '',
    setName: (name: string) => set({ trackName: name }),
    removeName: () => set({ trackName: '' }),
  }), {
    name: 'currentTracks',
  })
)
