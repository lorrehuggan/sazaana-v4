"use client"

import useStore from "@/lib/hooks/useStore"
import { useCurrentTracks } from "@/lib/stores/tracks"
import { Slider } from "../ui/slider"

export default function Filter() {
  const CURRENT_TRACKS = useStore(useCurrentTracks, (state) => state)

  return (
    <section>

      <p>filter</p>
      <div className="w-96">
        <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
      </div>
    </section>
  )
}
