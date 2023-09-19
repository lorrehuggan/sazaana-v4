"use client"
import { useAudioPlayer } from "@/lib/stores/audioPlayer"
import H3 from "../typography/H3"
import { motion, useAnimate, usePresence } from 'framer-motion'

import { Progress } from "@nextui-org/react";
import { countTo100In, countTo100InSeconds } from "@/lib/utils";
import { useEffect, useState } from "react";
import H4 from "../typography/H4";

export function AudioPlayer() {
  const [progress, setProgress] = useState(0)
  const AUDIO_PLAYER = useAudioPlayer((state) => state)

  const [isPresent, safeToRemove] = usePresence()
  const [scope, animate] = useAnimate()

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

  return <div ref={scope}
    className="fixed top-0 left-1/2 z-50 p-16 w-full max-w-6xl rounded-b-xl shadow-xl transform -translate-x-1/2 bg-stone-800/50 backdrop-blur-xl">
    <div className="flex gap-2 w-full h-full">
      <div>
        {/* eslint-disable-next-line */}
        <img src={AUDIO_PLAYER.trackDetails.albumArt} className="object-cover w-20 h-20" alt={AUDIO_PLAYER.trackDetails.album} />
      </div>
      <div className="flex flex-col flex-1 justify-between h-20">
        <p>{AUDIO_PLAYER.trackDetails.artist}</p>
        <div className="line-clamp-2">
          <H4>
            {AUDIO_PLAYER.trackDetails.track}
          </H4>
        </div>
        <div className="mt-2">
          <Progress size="sm" classNames={{
            track: "bg-zinc-50",
            indicator: "bg-zinc-500",
            base: "bg-zinc-500"
          }} value={progress} />
        </div>
      </div>
    </div>

  </div>
}
