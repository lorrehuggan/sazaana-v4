"use client"
import { AudioPlayer } from "@/components/app/audioPlayer";
import Filter from "@/components/app/filter";
import Tracklist from "@/components/app/tracklist";
import { useAudioPlayer } from "@/lib/stores/audioPlayer";
import { useCurrentArtists } from "@/lib/stores/currentArtists";


export default function Page() {
  const CURRENT_ARTIST = useCurrentArtists((state) => state)
  const AUDIO_PLAYER = useAudioPlayer((state) => state)

  //TODO: playlist based on users recent or best tracks
  return (
    <>
      <section className="container">
        {CURRENT_ARTIST.artists.length > 0 && (
          <>
            <Filter />
            <Tracklist />
          </>
        )}
        {AUDIO_PLAYER.open && (
          <AudioPlayer />
        )}
      </section>
    </>
  )
}
