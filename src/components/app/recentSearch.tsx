"use client"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'

import clsx from "clsx"

import { useCurrentQuery } from "@/lib/stores/query"
import { useCurrentArtists } from "@/lib/stores/currentArtists"
import { useCurrentTracks } from "@/lib/stores/tracks"
import useStore from "@/lib/hooks/useStore"

import { CornerLeftUp, MoveHorizontal, Trash2, X } from "lucide-react"


export default function RecentSearch() {
  const router = useRouter()
  const CURRENT_ARTISTS = useStore(useCurrentArtists, (state) => state)
  const CURRENT_TRACKS = useStore(useCurrentTracks, (state) => state)
  const QUERY = useCurrentQuery((state) => state)

  useEffect(() => {
    useCurrentArtists.persist.rehydrate()
    useCurrentTracks.persist.rehydrate()
  }, [])


  function handleClearRecents() {
    if (!CURRENT_ARTISTS || !CURRENT_TRACKS) return
    CURRENT_ARTISTS.clear()
    CURRENT_TRACKS.clear()
    useCurrentArtists.persist.clearStorage()
    useCurrentTracks.persist.clearStorage()
    router.push('/create')
  }

  function handleSelectArtist(artist: Spotify.ArtistObjectFull) {
    if (!CURRENT_ARTISTS) return
    if (artist.id === CURRENT_ARTISTS.artistID) return
    CURRENT_ARTISTS.setID(artist.id)
    CURRENT_ARTISTS.setName(artist.name)
  }

  function handleRemoveArtist(id: string) {
    if (!CURRENT_ARTISTS || !CURRENT_TRACKS) return
    if (id !== CURRENT_ARTISTS.artistID) return
    const filteredArtists = CURRENT_ARTISTS.artists.filter((artist) => artist.id !== id)
    CURRENT_ARTISTS.remove(id)

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

  if (!CURRENT_TRACKS || !CURRENT_ARTISTS || !CURRENT_ARTISTS.artists.length) return null

  return (
    <div className={clsx("container mt-4 transition-all duration-300 ease-in-out", {
      'opacity-10 pointer-events-none': QUERY.open,
    })}>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center text-neutral-500">
          {CURRENT_ARTISTS.artists.length < 5 ? (
            <CornerLeftUp size={16} />)
            :
            (
              <MoveHorizontal size={16} />
            )}
          <p className='text-sm font-bold text-neutral-500'>{CURRENT_ARTISTS.artists.length < 5 ? 'Fuse Another Artist' : 'Fusion Full Last Artist Will Be Removed'}</p>
        </div>
        <div onClick={handleClearRecents}
          className="flex items-center text-xs uppercase cursor-pointer text-muted color-fade hover:text-danger">
          <Trash2 size={16} className="inline-block ml-1" />
        </div>
      </div>
      <div className="flex overflow-x-scroll gap-3 items-center mt-2 scrollbar-none scrollbar-thumb-muted/70 scrollbar-track-background sm:scrollbar-thin">
        {CURRENT_ARTISTS.artists.slice(0, 5).reverse().map((artist, index) => (
          <div onClick={() => handleSelectArtist(artist)} key={index} className="relative group">
            {CURRENT_ARTISTS.artistID === artist.id && (
              <div onClick={() => handleRemoveArtist(artist.id)} className="absolute top-1/2 left-1/2 z-50 opacity-0 transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group-hover:opacity-100 hover:text-rose-300">
                <X size={46} />
              </div>
            )}
            {/* eslint-disable-next-line */}
            <img src={artist.images[1].url} className={clsx("transition-all object-cover grayscale  duration-300 ease-in-out h-32 min-w-[128px] w-32", {
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
