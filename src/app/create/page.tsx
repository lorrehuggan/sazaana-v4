"use client"
import Tracklist from "@/components/app/tracklist";
import { useCurrentArtists } from "@/lib/stores/currentArtists";

export default function Page() {
  const CURRENT_ARTIST = useCurrentArtists((state) => state)

  return (
    <section className="container">
      {CURRENT_ARTIST.artists.length > 0 && (
        <Tracklist />
      )}
    </section>
  )
}
