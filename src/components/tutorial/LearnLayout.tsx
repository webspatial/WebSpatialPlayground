import type { ReactNode } from 'react'
import { FileCode2, Play } from 'lucide-react'
import { LiveEditor } from '../LiveEditor'
import { LivePreview } from '../LivePreview'
import { RuntimeBadge } from '../RuntimeBanner'
import { detectRuntime } from '@/lib/runtime'

/**
 * The shared Learn Mode scaffold: left = code, right = live preview on top and a
 * card slot below. It's the same two-column shape {@link TutorialShell} uses for
 * a single lesson, extracted so the chapter overview and chapter wrap-up keep
 * the code and preview visible at all times — only the bottom card changes.
 *
 * Here the editor is read-only: the overview and wrap screens *show* code (the
 * starting point, or the finished scene) rather than asking for edits.
 */
export function LearnLayout({
  fileName,
  code,
  card,
}: {
  fileName: string
  /** Source shown read-only on the left and rendered live on the right. */
  code: string
  /** The guided card rendered in the bottom-right slot. */
  card: ReactNode
}) {
  const rt = detectRuntime()
  // Same honest desktop-fallback note the lesson shell shows, so the overview
  // and wrap preview read consistently with the lessons themselves.
  const annotation = !rt.isSpatial
    ? code.includes('<Reality')
      ? 'The 3D scene renders inside a WebSpatial Runtime — here you see the 2D container and your code.'
      : code.includes('<Model') || code.includes('--xr-depth')
        ? 'The model container is set up — full spatial rendering needs a supported WebSpatial Runtime.'
        : undefined
    : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* ─── Left: read-only code ─── */}
      <section className="flex min-h-0 flex-col border-b border-white/5 lg:w-[46%] lg:border-b-0 lg:border-r">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e18] px-4">
          <div className="flex items-center gap-2">
            <FileCode2 size={13} className="text-violet-400/80" />
            <span className="font-mono text-[11px] text-white/55">{fileName}</span>
            <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">
              preview
            </span>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <LiveEditor value={code} onChange={() => {}} language="tsx" readOnly />
        </div>
      </section>

      {/* ─── Right: preview (top) + card (bottom) ─── */}
      <section className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e18] px-4">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/55">
            <Play size={11} className="text-violet-400" />
            Live preview
          </span>
          <RuntimeBadge />
        </div>

        <div className="min-h-0 flex-1">
          <LivePreview source={code} annotation={annotation} gentleErrors />
        </div>

        <div className="max-h-[58%] shrink-0 overflow-auto border-t border-white/5 bg-[#0c0c14] px-5 py-4">
          {card}
        </div>
      </section>
    </div>
  )
}
