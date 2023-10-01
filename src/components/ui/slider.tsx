"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="overflow-hidden relative w-full h-1 rounded-full grow bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary/70" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block w-3 h-3 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-grab border-[1px] border-primary/70 bg-background ring-offset-background focus-visible:ring-ring" />
    <SliderPrimitive.Thumb className="block w-3 h-3 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-grab border-[1px] border-primary/70 bg-background ring-offset-background focus-visible:ring-ring" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
