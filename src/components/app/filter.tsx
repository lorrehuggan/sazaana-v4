"use client"

import { useEffect, useMemo, useState } from "react"
import { Slider } from "../ui/slider"
import UseFeaturesFilter from "@/lib/hooks/useFeaturesFilter"
import clsx from "clsx"
import { useFilteredTracks } from "@/lib/stores/filtered"

// const data = [
// 'acousticness',
// 'danceability',
// 'duration_ms',
// 'energy',
// 'instrumentalness',
// 'key',
// 'liveness',
// 'loudness',
// 'mode',
// 'popularity',
// 'speechiness',
// 'tempo',
// 'time_signature',
// 'valence',
// ]

export default function Filter() {
  const { updateFilterConfig } = UseFeaturesFilter()
  const [active, setActive] = useState('')
  const FILTERED_TRACKS = useFilteredTracks((state) => state)

  function OnChange(feature: string, minValue: number, maxValue: number) {
    setActive(feature)
    updateFilterConfig(feature, minValue, maxValue)
  }

  const data = useMemo(() => {
    return [
      'acousticness',
      'danceability',
      'energy',
      'valence',
    ]
  }, [])

  if (!FILTERED_TRACKS.tracks.length) return null

  return (
    <section className="container mt-4">
      <span className="mb-2 text-sm font-medium text-muted-foreground">Filter</span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((feature) => (
          <div key={feature} className="space-y-2">
            <p className={clsx("text-xs text-muted-foreground color-fade text-center capitalize", {
              'text-white': active === feature
            })}>{feature}</p>
            <Slider
              value={[Number(FILTERED_TRACKS.filterConfig[feature][0]), Number(FILTERED_TRACKS.filterConfig[feature][1])]}
              onBlur={() => setActive('')}
              onValueChange={(e) => OnChange(feature, e[0], e[1])}
              defaultValue={[0, 1]} max={1}
              step={0.01}
              className="w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
