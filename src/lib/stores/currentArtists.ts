import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type initialState = {
  artists: Spotify.ArtistObjectFull[]
  artistID: string
  artistName: string
}

export type Actions = {
  add: (artist: Spotify.ArtistObjectFull) => void
  remove: (id: string) => void
  clear: () => void
  set: (artists: Spotify.ArtistObjectFull[]) => void
  setID: (id: string) => void
  removeID: () => void
  setName: (name: string) => void
  removeName: () => void
}

export const useCurrentArtists = create<initialState & Actions>()(
  persist((set, get) => ({
    artists: [],
    add: (artist: Spotify.ArtistObjectFull) => set(state => ({ artists: [...state.artists, artist] })),
    remove: (id: string) => set(state => ({ artists: state.artists.filter(artist => artist.id !== id) })),
    clear: () => set({ artists: [] }),
    set: (artists: Spotify.ArtistObjectFull[]) => set({ artists }),
    artistID: '',
    setID: (id: string) => set({ artistID: id }),
    removeID: () => set({ artistID: '' }),
    artistName: '',
    setName: (name: string) => set({ artistName: name }),
    removeName: () => set({ artistName: '' }),

  }), {
    name: 'currentArtists',
  })
)
