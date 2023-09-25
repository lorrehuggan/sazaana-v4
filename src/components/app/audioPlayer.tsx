"use client"
import { useAudioPlayer } from "@/lib/stores/audioPlayer"
import H3 from "../typography/H3"
import { motion, useAnimate, usePresence } from 'framer-motion'
import { Howl, Howler } from "howler";

import { Progress } from "@nextui-org/react";
import { countTo100In, countTo100InSeconds } from "@/lib/utils";
import { useEffect, useState } from "react";
import H4 from "../typography/H4";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";


export function AudioPlayer() {
  const [progress, setProgress] = useState(0)
  const AUDIO_PLAYER = useAudioPlayer((state) => state)

  const [isPresent, safeToRemove] = usePresence()
  const [scope, animate] = useAnimate()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isPresent) {
      const enterAnimation = async () => {
        await animate(scope.current, {
          opacity: [0, 1],
        }, {
          duration: 1,
          ease: [0.175, 0.885, 0.32, 1.275]
        })
      }
      enterAnimation()
    } else {
      const exitAnimation = async () => {
        await animate(scope.current, {
          opacity: [1, 0],
        }, {
          duration: 1,
          ease: [0.175, 0.885, 0.32, 1.275]
        })
        safeToRemove()
      }
      exitAnimation()
    }
  }, [isPresent, animate, scope, safeToRemove])

  useEffect(() => {
    countTo100In(30, setProgress)
    return () => {
      setProgress(0)
    }
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      if (count < 30) {
        setCount((prevCount) => prevCount + 1);
      } else {
        clearInterval(interval); // Stop the counting when it reaches 30
      }
    }, 1000); // Count every 1000 milliseconds (1 second)

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, [count]);

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
  }



  return <div ref={scope}
    className="fixed top-0 left-1/2 z-50 p-14 w-full max-w-2xl rounded-b-xl shadow-xl transform -translate-x-1/2 bg-stone-800/30 backdrop-blur-xl">
    <div className="flex gap-2 w-full h-full">
      <div>
        {/* eslint-disable-next-line */}
        <img src={AUDIO_PLAYER.trackDetails.albumArt} className="object-cover w-24 h-24" alt={AUDIO_PLAYER.trackDetails.album} />
      </div>
      <div className="flex-1 space-y-1 h-20">
        <p className="text-sm">{AUDIO_PLAYER.trackDetails.artist}</p>
        <div className="line-clamp-2">
          <h4 className="font-bold">
            {AUDIO_PLAYER.trackDetails.track}
          </h4>
        </div>
        <div className="">
          <Progress size="sm" classNames={{
            track: "bg-zinc-50",
            indicator: "bg-zinc-500",
            base: "bg-zinc-500"
          }} value={progress} />
        </div>
        <div className="flex justify-between items-center text-xs">
          <p>{`0:${count < 10 ? 0 : ''}${count}`}</p>
          <p className="text-foreground/50">0:30</p>
        </div>
        <div className="flex justify-between items-center px-36">

          <SkipBack size={16} />
          <div className="cursor-pointer">
            {AUDIO_PLAYER.playing ? (<Pause onClick={stopAudio} size={18} />
            ) : <Play size={18} />}
          </div>
          <SkipForward size={16} />
        </div>

      </div>
    </div>

  </div>
}
