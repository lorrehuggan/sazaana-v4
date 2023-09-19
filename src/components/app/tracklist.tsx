"use client"
import clsx from "clsx"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react"
import { ArrowUpDown, Disc3 } from "lucide-react";
import { useCurrentTracks } from "@/lib/stores/tracks";
import { useCurrentArtists } from "@/lib/stores/currentArtists";
import { useQuery } from "@tanstack/react-query";
import { useCurrentQuery } from "@/lib/stores/query";
import Track from "./track";
import useStore from "@/lib/hooks/useStore";
import { StateStorage } from 'zustand/middleware'
import { ScrollShadow } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";



type Props = {
  data: Spotify.TrackObjectFull[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
export default function Tracklist() {
  const [dragging, setDragging] = useState<string | null>(null)
  const CURRENT_ARTISTS_IDS = useStore(useCurrentArtists, (state) => state.artists.map((artist) => artist.id).join(','))
  const CURRENT_TRACKS = useStore(useCurrentTracks, (state) => state)
  const { data, isLoading, isError } = useQuery<Spotify.TrackObjectFull[]>({
    queryKey: [`tracklist-${CURRENT_ARTISTS_IDS}`],
    queryFn: () => fetcher(`/api/recommendation?ids=${CURRENT_ARTISTS_IDS}`),
    refetchOnWindowFocus: false,
    enabled: !!CURRENT_ARTISTS_IDS && useCurrentTracks.persist.hasHydrated(),
  })
  const QUERY = useCurrentQuery((state) => state)
  const [tracklistHover, setTracklistHover] = useState(false)


  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem('currentArtists')!)
    if (cached) console.log(cached.state)

    if (!data) return
    CURRENT_TRACKS?.set(data)
  }, [data])

  function handleOnDragEnd(result: any) {
    if (!CURRENT_TRACKS) return

    setDragging(null)
    if (!result.destination) return;
    const items = Array.from(CURRENT_TRACKS.tracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    CURRENT_TRACKS.set(items)
  }

  function handleOnDragStart(result: any) {
    if (!result.draggableId) return;
    setDragging(result.draggableId)
  }



  return (
    <section className={clsx("mt-4 transition-all duration-300 ease-in-out", {
      "opacity-10": QUERY.open,
    })}>
      <div className="flex gap-4 items-center p-2 text-muted">
        {isLoading ? <div className="flex gap-1 items-center text-sm"> <Disc3 size={16} className="animate-spin" />Loading...</div> : (
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
            <div className="hidden sm:flex">
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
          <div className="w-12 h-12">
          </div>
        </div>
      )) : (
        <div onMouseOver={() => setTracklistHover(true)} onMouseLeave={() => setTracklistHover(false)}>
          <ScrollShadow className={clsx("lg:h-[610px] scrollbar-none scrollbar-thumb-muted/70 scrollbar-track-background transition-all duration-300 ease-in-out sm:scrollbar-thin", {
            "sm:scrollbar-thumb-muted/50": tracklistHover,
            "sm:scrollbar-thumb-muted/0": !tracklistHover
          })} >
            <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
              <Droppable droppableId="tracklist">
                {provided => (
                  <ul className="mt-1" {...provided.droppableProps} ref={provided.innerRef}>
                    {CURRENT_TRACKS && CURRENT_TRACKS.tracks && CURRENT_TRACKS.tracks.map((track, i) => (
                      <Draggable key={track.id} draggableId={track.id} index={i}>
                        {provided => (
                          <Track provided={provided} track={track} i={i} dragging={dragging} />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </ScrollShadow>
        </div>
      )}
    </section>
  )
}
