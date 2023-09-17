"use client"
import clsx from "clsx"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react"
import { ArrowUpDown } from "lucide-react";
import { useCurrentTracks } from "@/lib/stores/tracks";
import { useCurrentArtists } from "@/lib/stores/currentArtists";
import { useQuery } from "@tanstack/react-query";
import { useCurrentQuery } from "@/lib/stores/query";
import Track from "./track";
import useStore from "@/lib/hooks/useStore";

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
    enabled: !!CURRENT_ARTISTS_IDS,
  })
  const QUERY = useCurrentQuery((state) => state)


  useEffect(() => {
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

  if (isLoading) return <p>loading</p>


  return (
    <section className={clsx("mt-4 transition-all duration-300 ease-in-out", {
      "opacity-10": QUERY.open,
    })}>
      <div className="flex gap-4 items-center p-2 text-muted">
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
        <div className="flex-1">
          <p className={clsx("text-xs line-clamp-1 transition-all duration-300 ease-in-out", {
            "opacity-0": dragging,
          })}>Album</p>
        </div>
        <div>
          <p className={clsx("text-xs line-clamp-1 transition-all duration-300 ease-in-out", {
            "opacity-0": dragging,
          })}>Time</p>
        </div>
      </div>
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
    </section>
  )
}
