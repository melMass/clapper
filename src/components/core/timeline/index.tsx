import { useEffect } from "react"
import { ClapTimeline, useTimeline, SegmentResolver } from "@aitube/timeline"

import { cn } from "@/lib/utils"
import { useMonitor } from "@/controllers/monitor/useMonitor"
import { useResolver } from "@/controllers/resolver/useResolver"


export function Timeline() {
  const isReady = useTimeline(s => s.isReady)

  const resolveSegment: SegmentResolver = useResolver(s => s.resolveSegment)
  const setSegmentResolver = useTimeline(s => s.setSegmentResolver)

  const jumpAt = useMonitor(s => s.jumpAt)
  const checkIfPlaying = useMonitor(s => s.checkIfPlaying)
  const togglePlayback = useMonitor(s => s.togglePlayback)

  const setJumpAt = useTimeline(s => s.setJumpAt)
  const setIsPlaying = useTimeline(s => s.setIsPlaying)
  const setTogglePlayback = useTimeline(s => s.setTogglePlayback)

  const startLoop = useResolver(s => s.startLoop)

  // this is important: we connect the monitor to the timeline
  useEffect(() => {
    if (!isReady) { return }
    setSegmentResolver(resolveSegment)
    setJumpAt(jumpAt)
    setIsPlaying(checkIfPlaying)
    setTogglePlayback(togglePlayback)
    startLoop()
  }, [isReady])
  
  
  return (
    <ClapTimeline
      showFPS={false}
      className={cn(
        "bg-[rgb(58,54,50)]"
      )}
    />
  )
}