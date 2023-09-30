"use client"

import { Slider } from "../ui/slider"
import UseFeaturesFilter from "@/lib/hooks/useFeaturesFilter"

export default function Filter() {
  const { updateFilterConfig } = UseFeaturesFilter()

  function OnChange(feature: string, minValue: number, maxValue: number) {
    // console.log(feature, minValue, maxValue)
    updateFilterConfig(feature, minValue, maxValue)
  }

  return (
    <section>
      <p className="flex mb-2 text-sm text-muted-foreground">Energy</p>
      <div className="space-y-4 w-64">
        <Slider
          onValueChange={(e) => OnChange('energy', e[0], e[1])}
          defaultValue={[0, 1]} max={1}
          step={0.1}
          className="w-full" />
      </div>
    </section>
  )
}
