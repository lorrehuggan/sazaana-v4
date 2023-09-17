import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type TrackDetails = {
  artist: string
  track: string
  album: string
  albumArt: string
  id: string
  position?: number
}

export type initialState = {
  open: boolean
  playing: boolean
  trackDetails: TrackDetails
  position?: number
}

export type Actions = {
  toggle: () => void
  setPlaying: (playing: boolean) => void
  set: (details: TrackDetails) => void
  setOpen: (open: boolean) => void
  setPosition?: (position: number) => void

}

export const useAudioPlayer = create<initialState & Actions>()(
  (set, get) => ({
    trackDetails: {
      id: '',
      artist: '',
      track: '',
      album: '',
      albumArt: ''
    },
    open: false,
    playing: false,
    position: 0,
    setPosition: (position: number) => set({ position }),
    setOpen: (open: boolean) => set({ open }),
    toggle: () => set(state => ({ open: !state.open })),
    set: (trackDetails: TrackDetails) => set({ trackDetails }),
    setPlaying: (playing: boolean) => set({ playing })
  })
)
