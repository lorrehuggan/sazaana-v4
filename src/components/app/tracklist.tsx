"use client"
import { useCurrentArtists } from "@/lib/stores/currentArtists"
import clsx from "clsx"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react"
import { ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetcher = (url: string) => fetch(url).then((res) => res.json())
export default function Tracklist() {
  const currentArtistsIDs = useCurrentArtists((state) => state.artists.map((artist) => artist.id).join(','))
  const currentArtist = useCurrentArtists((state) => state.artistID)
  const { data, isLoading, isError } = useQuery<Spotify.TrackObjectFull[]>({
    queryKey: [`tracklist/${currentArtistsIDs}`],
    queryFn: () => fetcher(`/api/recommendation?ids=${currentArtistsIDs}`),
    refetchOnWindowFocus: false,
  })
  const [tracks, setTracks] = useState<Spotify.TrackObjectFull[]>([])
  const [dragging, setDragging] = useState<string | null>(null)

  useEffect(() => {
    const cachedTracks = localStorage.getItem(`tracks-${currentArtist}`)
    if (data && !cachedTracks) {
      setTracks(data)
      localStorage.setItem(`tracks-${currentArtist}`, JSON.stringify(data))
    } else if (cachedTracks) {
      setTracks(JSON.parse(cachedTracks))
    } else {
      setTracks([])
    }
    return () => {
      setTracks([])
    }
  }, [data, currentArtist])

  function handleOnDragEnd(result: any) {
    setDragging(null)
    if (!result.destination) return;
    const items = Array.from(tracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTracks(items)
  }

  function handleOnDragStart(result: any) {
    if (!result.draggableId) return;
    setDragging(result.draggableId)
  }

  if (isLoading) return <div className="container">Loading...</div>

  if (isError) return <div className="container">Oops this is embarrasing</div>



  return (
    <section className="container mt-4">
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
              {tracks && tracks.map((track, i) => (
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
