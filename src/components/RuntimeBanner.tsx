import { Glasses, Monitor } from 'lucide-react'
import { detectRuntime } from '@/lib/runtime'

/**
 * Honest runtime badge. A real WebSpatial build ALWAYS renders flat in an
 * ordinary browser by design — this banner sets that expectation instead of
 * pretending the 2D fallback is the spatial experience.
 */
export function RuntimeBanner() {
  const rt = detectRuntime()

  if (rt.isSpatial) {
    const platform = rt.isVisionOS ? 'visionOS' : rt.isPico ? 'PICO OS' : 'WebSpatial'
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-[11px] bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-200">
        <Glasses size={13} className="text-emerald-400 shrink-0" />
        <span>
          <strong className="font-semibold">Spatial mode active</strong> — running inside the {platform} WebSpatial
          Runtime{rt.runtimeVersion ? ` (v${rt.runtimeVersion})` : ''}. Elements render with true depth, materials and
          spatial gestures.
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-[11px] bg-amber-500/10 border-b border-amber-500/20 text-amber-100/90">
      <Monitor size={13} className="text-amber-400 shrink-0" />
      <span>
        You're viewing in a <strong className="font-semibold">flat 2D browser</strong> — this is a genuine WebSpatial
        build, and WebSpatial elements render flat here by design. Open this app on{' '}
        <strong className="font-semibold">Apple Vision Pro</strong> or <strong className="font-semibold">PICO OS 6</strong>{' '}
        to see true spatial rendering.
      </span>
    </div>
  )
}
