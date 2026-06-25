import { Glasses, Monitor } from 'lucide-react'
import { detectRuntime } from '@/lib/runtime'

/**
 * Compact, honest runtime badge. A real WebSpatial build ALWAYS renders flat in
 * an ordinary browser by design — this badge sets that expectation instead of
 * pretending the 2D fallback is the spatial experience.
 */
export function RuntimeBadge() {
  const rt = detectRuntime()

  if (rt.isSpatial) {
    const platform = rt.isVisionOS ? 'visionOS' : rt.isPico ? 'PICO OS' : 'WebSpatial'
    return (
      <span
        title={`Running inside the ${platform} WebSpatial Runtime — elements render with true depth, materials and spatial gestures.`}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-200"
      >
        <Glasses size={11} className="text-emerald-400" />
        Spatial runtime{rt.runtimeVersion ? ` · v${rt.runtimeVersion}` : ''}
      </span>
    )
  }

  return (
    <span
      title="This is a genuine WebSpatial build. WebSpatial elements render flat in a 2D browser by design — open on Apple Vision Pro or PICO OS 6 to see true spatial rendering."
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-100/90"
    >
      <Monitor size={11} className="text-amber-400" />
      2D browser fallback
    </span>
  )
}
