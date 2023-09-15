"use client"
import { useCurrentArtists } from "@/lib/stores/currentArtists"
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from "react"
import P from "../typography/P"
import { Trash2 } from "lucide-react"
import clsx from "clsx"
import Link from "next/link"


export default function RecentSearch() {
  const router = useRouter()
  const params = useParams()
  const [artistsState, setArtistsState] = useState<Spotify.ArtistObjectFull[] | []>([])
  const clearCurrentArtists = useCurrentArtists((state) => state.clear)
  const currentArtistID = useCurrentArtists((state) => state.artistID)
  const setCurrentArtistID = useCurrentArtists((state) => state.setID)
  const setCurrentArtistName = useCurrentArtists((state) => state.setName)

  useEffect(() => {
    const artists: Spotify.ArtistObjectFull[] = JSON.parse(localStorage.getItem('currentArtists')!).state.artists
    if (!artists) return
    setArtistsState(artists.reverse())
    // if (!params.id && currentArtistID) {
    //   router.push(`/artist/${currentArtistID}`)
    // }
    return
  }, [currentArtistID, params.id, router])

  function handleClearRecents() {
    setArtistsState([])
    clearCurrentArtists()
    localStorage.removeItem('currentArtists')
  }

  function handleSelectArtist(id: string, name: string) {
    setCurrentArtistID(id)
    setCurrentArtistName(name)
    // router.push(`/artist/${id}`)
  }


  if (!artistsState.length) return null

  return (
    <div className="container mt-4">
      <div className="flex justify-between items-center">
        <P className='font-bold'>Recently Searched Artist</P>
        <div onClick={handleClearRecents}
          className="flex items-center text-xs uppercase cursor-pointer text-muted color-fade hover:text-danger">
          <span>clear recent</span>
          <Trash2 size={16} className="inline-block ml-1" />
        </div>
      </div>
      <div className="flex overflow-x-scroll gap-3 items-center mt-2 scrollbar-none scrollbar-thumb-muted/70 scrollbar-track-background sm:scrollbar-thin">
        {artistsState.slice(0, 12).map((artist, index) => (
          <div onClick={() => handleSelectArtist(artist.id, artist.name)} key={index}>
            {/* eslint-disable-next-line */}
            <img src={artist.images[2].url} className={clsx("transition-all grayscale  duration-300 ease-in-out h-32 w-32", {
              "opacity-20": currentArtistID !== artist.id,
            })} />
            <p className="mt-1 text-xs text-stone-400">{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  )

}
