import { AlbumWithAudioFeatures, TrackWithFeatures } from '@/types/index'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Features = {
  acousticness: number[]
  danceability: number[]
  energy: number[]
  instrumentalness: number[]
  liveness: number[]
  speechiness: number[]
  valence: number[]
  tempo: number[]
  popularity: number[]
  duration_ms: number[]
  key: number[]
  mode: number[]
  time_signature: number[]
}

export type initialState = {
  tracks: TrackWithFeatures[]
  features: Features
}

export type Actions = {
  set: (tracks: TrackWithFeatures[]) => void
  clear: () => void
  setFilter: (filter: Features) => void
}

export const useFilteredTracks = create<initialState & Actions>()(
  persist((set, get) => ({
    features: {
      acousticness: [0, 1],
      danceability: [0, 1],
      energy: [0, 1],
      instrumentalness: [0, 1],
      liveness: [0, 1],
      speechiness: [0, 1],
      valence: [0, 1],
      tempo: [0, 1],
      popularity: [0, 100],
      duration_ms: [0, 1000],
      key: [0, 11],
      mode: [0, 1],
      time_signature: [0, 5],
    },
    setFilter: (features: Features) => set({ features }),
    tracks: [],
    set: (tracks: TrackWithFeatures[]) => set({ tracks }),
    clear: () => set({ tracks: [] }),
  }), {
    name: 'filteredTracks',
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
  })

)
