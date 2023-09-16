"use client"
import clsx from "clsx"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react"
import { ArrowUpDown } from "lucide-react";
import { useCurrentTracks } from "@/lib/stores/tracks";
import { useCurrentArtists } from "@/lib/stores/currentArtists";
import { useQuery } from "@tanstack/react-query";
import { useCurrentQuery } from "@/lib/stores/query";

type Props = {
  data: Spotify.TrackObjectFull[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())
export default function Tracklist() {
  const [dragging, setDragging] = useState<string | null>(null)
  const CURRENT_ARTISTS_IDS = useCurrentArtists((state) => state.artists.map((artist) => artist.id).join(','))
  const CURRENT_ARTIST = useCurrentArtists((state) => state)
  const SET_CURRENT_TRACKS = useCurrentTracks((state) => state.set)
  const CURRENT_TRACKS = useCurrentTracks((state) => state)
  const { data, isLoading, isError } = useQuery<Spotify.TrackObjectFull[]>({
    queryKey: [`tracklist/${CURRENT_ARTISTS_IDS}`],
    queryFn: () => fetcher(`/api/recommendation?ids=${CURRENT_ARTISTS_IDS}`),
    refetchOnWindowFocus: false,
    enabled: !!CURRENT_ARTISTS_IDS,
  })
  const QUERY = useCurrentQuery((state) => state)


  useEffect(() => {
    const cachedTracks = localStorage.getItem(`tracks-${CURRENT_ARTIST.artistName}`)
    if (data && !cachedTracks) {
      SET_CURRENT_TRACKS(data)
    } else if (cachedTracks) {
      SET_CURRENT_TRACKS(JSON.parse(cachedTracks))
    } else {
      SET_CURRENT_TRACKS([])
    }
  }, [data, SET_CURRENT_TRACKS, CURRENT_ARTIST.artistName])

  function handleOnDragEnd(result: any) {
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
              {CURRENT_TRACKS.tracks && CURRENT_TRACKS.tracks.map((track, i) => (
                <Draggable key={track.id} draggableId={track.id} index={i}>
                  {provided => (
                    <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} key={track.id} className={clsx("flex items-center p-2 gap-4 group hover:bg-stone-800 color-fade", {
                      "bg-muted/10": i % 2 === 0,
                      "opacity-50": dragging === track.id,
                    })}>
                      { /* eslint-disable-next-line */}
                      <img src={track.album.images[1].url} alt={track.name} className={clsx("object-cover w-12 h-12 transition-all duration-300 ease-in-out cursor-pointer grayscale group-hover:grayscale-0", {
                        "grayscale-0": dragging === track.id,
                      })} />
                      <div className="flex-1">
                        <span className="text-sm line-clamp-1">{track.name}</span>
                      </div>
                      <div className="flex-1">
                        <a href={`/artist/${track.artists[0].id}`} className="inline-block text-sm cursor-pointer line-clamp-1 color-fade hover:text-stone-400">{track.artists[0].name}</a>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm line-clamp-1">{track.album.name}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm">2:34</span>
                      </div>
                    </li>
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
