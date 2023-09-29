import { convertMsToMinutesAndSeconds, debounce } from "@/lib/utils"
import clsx from "clsx"
import { DraggableProvided } from "react-beautiful-dnd"
import { Howl, Howler } from "howler";
import { Disc3, Play } from "lucide-react";
import { useAudioPlayer } from "@/lib/stores/audioPlayer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlbumWithAudioFeatures, TrackWithFeatures } from "@/types/index";

type Props = {
  provided?: DraggableProvided
  track: TrackWithFeatures
  dragging: string | null
  i: number
}
export default function Track({ provided, track, dragging, i }: Props) {
  const AUDIO_PLAYER = useAudioPlayer((state) => state)
  const trackName = track.track.name
  const trackPreview = track.track.preview_url
  const trackDuration = track.track.duration_ms
  const trackArtist = track.track.artists[0].name
  const trackAlbum = track.track.album.name
  const trackImage = track.track.album.images[1].url
  const trackId = track.track.id
  const trackUrl = track.track.external_urls.spotify
  const [state, setState] = useState('')
  const [playingID, setPlayingID] = useState<string | null>(null)
  const [trackNumber, setTrackNumber] = useState(i + 1)

  useEffect(() => {
    const unsub = useAudioPlayer.subscribe((state, prev) => {
      if (state.playing) {
        setPlayingID(state.trackDetails.id)
      } else {
        setPlayingID(null)
      }
    })
    return () => unsub()
  }, [])

  const sound = new Howl({
    src: [trackPreview ?? ''],
    html5: true,
    autoplay: false,
    format: ["mp3"],
    loop: false,
    volume: 0.6,
    onloaderror: function() {
    },
    onplayerror: function() {
    },
    onload: function() {
    },
    onplay: function() {
      AUDIO_PLAYER.setPlaying(true)
      AUDIO_PLAYER.set({
        artist: trackArtist,
        album: trackAlbum,
        albumArt: trackImage,
        track: trackName,
        id: trackId
      })
      AUDIO_PLAYER.setOpen(true)
      setState(trackPreview ?? '')
    },
    onend: function() {
      AUDIO_PLAYER.setPlaying(false)
      AUDIO_PLAYER.setOpen(false)
      AUDIO_PLAYER.set({
        artist: "",
        album: "",
        albumArt: "",
        track: "",
        id: ""
      })
      setState('')
    },
  });

  function stopAudio() {
    Howler.stop();
    AUDIO_PLAYER.setPlaying(false)
    AUDIO_PLAYER.set({
      artist: "",
      album: "",
      albumArt: "",
      track: "",
      id: ""
    })
    AUDIO_PLAYER.setOpen(false)
    setState('')
  }

  function playAudio(songUrl: string) {
    if (!songUrl) return;
    if (songUrl === state) {
      stopAudio()
      return;
    }
    if (AUDIO_PLAYER.playing && songUrl !== state) {
      stopAudio()
      sound.play();
      return
    }
    sound.play()
  }

  return (
    <div key={trackId} className={clsx("flex items-center p-2 gap-4 group sm:hover:bg-stone-800 color-fade", {
      "bg-muted/10": i % 2 === 0,
      "opacity-50": dragging === trackId,
      "bg-stone-800": playingID === trackId,
      "cursor-grabbing": dragging === trackId,
      "cursor-grab": dragging !== trackId,
    })}>
      <div className="relative" onClick={() => playAudio(trackPreview ?? '')}>
        {trackPreview ? (
          <Play size={24} className={clsx("absolute top-1/2 left-1/2 z-50 opacity-0 transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 cursor-pointer mix-blend-difference", {
            "opacity-0": playingID === trackId,
            "sm:group-hover:opacity-100": playingID !== trackId,
          })} />
        ) : null}
        <div className="overflow-hidden bg-muted">
          { /* eslint-disable-next-line */}
          {playingID === trackId ? (<div className={clsx("flex justify-center items-center w-12 h-12 transition-all duration-300 ease-in-out", {
            "opacity-0": playingID !== trackId,
          })}><Disc3 className="animate-spin" size={24} /></div>) :
            (
              <img src={trackImage} alt={trackName} className={clsx("object-cover w-12 h-12 transition-all duration-300 ease-in-out cursor-pointer grayscale sm:group-hover:bg-muted sm:group-hover:opacity-0", {
                "opacity-40": dragging === trackId,
              })} />
            )}
        </div>
      </div>
      <div className="flex-1">
        <span className="text-xs sm:text-sm line-clamp-1">{trackName}</span>
      </div>
      <div className="flex-1">
        <span className="inline-block text-xs cursor-pointer sm:text-sm line-clamp-1 color-fade sm:hover:text-stone-400">{trackArtist}</span>
      </div>
      <div className="hidden flex-1 sm:flex">
        <span className="text-sm line-clamp-1">{trackName}</span>
      </div>
      <div className="gap-2 items-center flex-[0.1]">
        <span className="text-xs sm:text-sm">{convertMsToMinutesAndSeconds(trackDuration)}</span>
      </div>
    </div>
  )
}
