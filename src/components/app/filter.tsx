"use client"

import { useEffect, useState } from "react"
import { Slider } from "../ui/slider"
import UseFeaturesFilter from "@/lib/hooks/useFeaturesFilter"
import clsx from "clsx"

const data = [
  'acousticness',
  'danceability',
  // 'duration_ms',
  'energy',
  // 'instrumentalness',
  // 'key',
  // 'liveness',
  // 'loudness',
  // 'mode',
  // 'popularity',
  // 'speechiness',
  // 'tempo',
  // 'time_signature',
  'valence',
]

export default function Filter() {
  const { updateFilterConfig } = UseFeaturesFilter()
  const [active, setActive] = useState('')

  function OnChange(feature: string, minValue: number, maxValue: number) {
    setActive(feature)
    updateFilterConfig(feature, minValue, maxValue)
  }


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
              onBlur={() => setActive('')}
              onValueChange={(e) => OnChange(feature, e[0], e[1])}
              defaultValue={[0, 1]} max={1}
              step={0.05}
              className="w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
