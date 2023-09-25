"use client"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { ArrowUpDown, Disc3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reorder } from "framer-motion"

import Track from "./track";

import { useCurrentTracks } from "@/lib/stores/tracks";
import { useCurrentArtists } from "@/lib/stores/currentArtists";
import { useCurrentQuery } from "@/lib/stores/query";
import useStore from "@/lib/hooks/useStore";
import { ScrollShadow } from "@nextui-org/react";




const fetcher = (url: string) => fetch(url).then((res) => res.json())
export default function Tracklist() {
  const [dragging, setDragging] = useState<string | null>(null)
  const [isLocal, setIsLocal] = useState(false)
  const CURRENT_ARTISTS_IDS = useStore(useCurrentArtists, (state) => state.artists.map((artist) => artist.id).join(','))
  const CURRENT_TRACKS = useStore(useCurrentTracks, (state) => state)
  const { data, isLoading, isError } = useQuery < Array<Spotify.TrackObjectFull & { audio_features: Spotify.AudioFeaturesObject }>({
    queryKey: [`tracklist-${CURRENT_ARTISTS_IDS}`],
    queryFn: () => fetcher(`/api/recommendation?ids=${CURRENT_ARTISTS_IDS}`),
    refetchOnWindowFocus: false,
    enabled: !!CURRENT_ARTISTS_IDS,
  })
  const QUERY = useCurrentQuery((state) => state)
  const [tracklistHover, setTracklistHover] = useState(false)


  useEffect(() => {
    if (!data) return
    CURRENT_TRACKS?.set(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  function handleOnDragEnd(result: any) {
    if (!result) return
    if (!CURRENT_TRACKS) return
    CURRENT_TRACKS.set(result)
  }


  return (
    <section className={clsx("mt-4 transition-all duration-300 ease-in-out", {
      "opacity-10": QUERY.open,
    })}>
      <div className="flex gap-4 items-center p-2 text-muted">
        {isLoading ? <div className="flex gap-1 items-center text-sm"> <Disc3 size={16} className="animate-spin" />Generating...</div> : (
          <>
            <div className="flex-1 mr-16">
              {dragging ? <ArrowUpDown size={14} /> :
                <p className={clsx("text-xs line-clamp-1 transition-all duration-300 ease-in-out", {
                  "opacity-0": dragging,
                })}>Song</p>
              }
            </div>
            <div className="flex-1">
              <p className={clsx("text-xs line-clamp-1 transition-all duration-300 ease-in-out", {
                "opacity-0": dragging,
              })}>Artist</p>
            </div>
            <div className="hidden flex-1 sm:flex">
              <p className={clsx("text-xs line-clamp-1 transition-all duration-300 ease-in-out", {
                "opacity-0": dragging,
              })}>Album</p>
            </div>
            <div className="flex-[0.1]">
              <p className={clsx("text-xs line-clamp-1 transition-all duration-300 ease-in-out", {
                "opacity-0": dragging,
              })}>Time</p>
            </div>
          </>
        )}
      </div>
      {isLoading ? new Array(9).fill(0).map((_, i) => (
        <div key={i} className={clsx("flex items-center gap-2 p-2", {
          "bg-muted/10": i % 2 === 0,
        })}>
          <div className="w-10 h-10">
          </div>
        </div>
      )) : (
        <div onMouseOver={() => setTracklistHover(true)} onMouseLeave={() => setTracklistHover(false)}>
          <ScrollShadow className={clsx("lg:max-h-[550px] scrollbar-none scrollbar-thumb-muted/70 scrollbar-track-background transition-all duration-300 ease-in-out sm:scrollbar-thin", {
            "sm:scrollbar-thumb-muted/50": tracklistHover,
            "sm:scrollbar-thumb-muted/0": !tracklistHover
          })} >
            <Reorder.Group
              layoutScroll
              axis='y'
              values={CURRENT_TRACKS?.tracks ?? []}
              onReorder={handleOnDragEnd}>
              {CURRENT_TRACKS && CURRENT_TRACKS.tracks && CURRENT_TRACKS.tracks.map((track, i) => (
                <Reorder.Item key={track.id} value={track} onDrag={() => setDragging(track.id)} onDragEnd={() => setDragging(null)}>
                  <Track track={track} i={i} dragging={dragging} />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </ScrollShadow>
        </div>
      )}
    </section>
  )
}
