import { AlbumWithAudioFeatures, TrackWithFeatures } from '@/types/index'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Features = {
  acousticness: number[],
  danceability: number[],
  duration_ms: number[],
  energy: number[],
  instrumentalness: number[],
  key: number[],
  liveness: number[],
  loudness: number[],
  mode: number[],
  popularity: number[],
  speechiness: number[],
  tempo: number[],
  time_signature: number[],
  valence: number[],
}

export type initialState = {
  tracks: TrackWithFeatures[]
  filterConfig: Features
}

export type Actions = {
  set: (tracks: TrackWithFeatures[]) => void
  clear: () => void
  setFilterConfig: (filter: Features) => void
  resetFilterConfig: () => void
}

export const useFilteredTracks = create<initialState & Actions>()(
  persist((set, get) => ({
    filterConfig: {
      acousticness: [0, 1],
      danceability: [0, 1],
      duration_ms: [0, 1],
      energy: [0, 1],
      instrumentalness: [0, 1],
      key: [0, 1],
      liveness: [0, 1],
      loudness: [0, 1],
      mode: [0, 1],
      popularity: [0, 1],
      speechiness: [0, 1],
      tempo: [0, 1],
      time_signature: [0, 1],
      valence: [0, 1],
    },
    setFilterConfig: (filterConfig: Features) => set({ filterConfig }),
    tracks: [],
    set: (tracks: TrackWithFeatures[]) => set({ tracks }),
    clear: () => set({ tracks: [] }),
    resetFilterConfig: () => set({
      filterConfig: {
        acousticness: [0, 1],
        danceability: [0, 1],
        duration_ms: [0, 1],
        energy: [0, 1],
        instrumentalness: [0, 1],
        key: [0, 1],
        liveness: [0, 1],
        loudness: [0, 1],
        mode: [0, 1],
        popularity: [0, 1],
        speechiness: [0, 1],
        tempo: [0, 1],
        time_signature: [0, 1],
        valence: [0, 1],
      }
    })
  }), {
    name: 'filteredTracks',
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
  })

)
