"use client"
import { useCurrentArtists } from "@/lib/stores/currentArtists"
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from "react"
import P from "../typography/P"
import { Trash2, X } from "lucide-react"
import clsx from "clsx"
import { useCurrentQuery } from "@/lib/stores/query"
import { useCurrentTracks } from "@/lib/stores/tracks"


export default function RecentSearch() {
  const router = useRouter()
  const [artistsState, setArtistsState] = useState<Spotify.ArtistObjectFull[] | []>([])
  const CURRENT_ARTISTS = useCurrentArtists((state) => state)
  const CURRENT_TRACKS = useCurrentTracks((state) => state)
  const QUERY = useCurrentQuery((state) => state)

  useEffect(() => {
    if (CURRENT_ARTISTS.artists.length) {
      setArtistsState(CURRENT_ARTISTS.artists)
      return
    }
    const artists: Spotify.ArtistObjectFull[] = JSON.parse(localStorage.getItem('currentArtists')!).state.artists

    if (!artists) return

    setArtistsState(artists)

    localStorage.setItem('currentArtists', JSON.stringify({ state: { artists } }))

    return () => { }
  }, [CURRENT_ARTISTS.artistID, CURRENT_ARTISTS.artists])

  function handleClearRecents() {
    setArtistsState([])
    CURRENT_ARTISTS.clear()
    CURRENT_TRACKS.clear()
    router.push('/create')
  }

  function handleSelectArtist(artist: Spotify.ArtistObjectFull) {
    if (artist.id === CURRENT_ARTISTS.artistID) return
    CURRENT_ARTISTS.setID(artist.id)
    CURRENT_ARTISTS.setName(artist.name)
  }

  function handleRemoveArtist(id: string) {
    if (id !== CURRENT_ARTISTS.artistID) return
    const filteredArtists = artistsState.filter((artist) => artist.id !== id)
    setArtistsState(filteredArtists)
    CURRENT_ARTISTS.remove(id)
    // localStorage.removeItem(`tracks-${id}`)

    if (filteredArtists.length) {
      const lastArtist = filteredArtists.at(-1)
      if (!lastArtist) return
      CURRENT_ARTISTS.setID(lastArtist.id)
      CURRENT_ARTISTS.setName(lastArtist.name)
    } else {
      CURRENT_ARTISTS.clear()
      CURRENT_TRACKS.clear()
    }
  }

  if (!artistsState.length) return null

  return (
    <div className={clsx("container mt-4 transition-all duration-300 ease-in-out", {
      'opacity-10 pointer-events-none': QUERY.open,
    })}>
      <div className="flex justify-between items-center">
        <P className='font-bold text-neutral-500'>Tracklist Based On</P>
        <div onClick={handleClearRecents}
          className="flex items-center text-xs uppercase cursor-pointer text-muted color-fade hover:text-danger">
          <span>Clear</span>
          <Trash2 size={16} className="inline-block ml-1" />
        </div>
      </div>
      <div className="flex overflow-x-scroll gap-3 items-center mt-2 scrollbar-none scrollbar-thumb-muted/70 scrollbar-track-background sm:scrollbar-thin">
        {artistsState.slice(0, 5).reverse().map((artist, index) => (
          <div onClick={() => handleSelectArtist(artist)} key={index} className="relative group">
            {CURRENT_ARTISTS.artistID === artist.id && (
              <div onClick={() => handleRemoveArtist(artist.id)} className="absolute top-1/2 left-1/2 z-50 opacity-0 transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover:opacity-100 hover:text-rose-300">
                <X size={46} />
              </div>
            )}
            {/* eslint-disable-next-line */}
            <img src={artist.images[1].url} className={clsx("transition-all object-cover grayscale  duration-300 ease-in-out h-32 w-32", {
              "opacity-10 cursor-pointer": CURRENT_ARTISTS.artistID !== artist.id,
              "hover:opacity-70": CURRENT_ARTISTS.artistID === artist.id,
            })} />
            <p className="mt-1 text-xs text-stone-400">{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  )

}
