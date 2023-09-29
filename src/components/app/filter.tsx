"use client"

import useStore from "@/lib/hooks/useStore"
import { useCurrentTracks } from "@/lib/stores/tracks"
import { Slider } from "../ui/slider"
import UseFeaturesFilter from "@/lib/hooks/useFeaturesFilter"

export default function Filter() {
  const CURRENT_TRACKS = useStore(useCurrentTracks, (state) => state)
  const { updateFilterConfig } = UseFeaturesFilter()

  function OnChange(feature: string, minValue: number, maxValue: number) {

    updateFilterConfig(feature, minValue, maxValue)
  }

  return (
    <section>

      <p>filter</p>
      <div className="w-96">
        <Slider onValueChange={(e) => OnChange('danceabillity', 0, e[0])} defaultValue={[0]} max={1} step={0.05} className="w-full" />
      </div>
    </section>
  )
}
