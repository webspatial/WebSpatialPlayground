import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, Sparkles } from 'lucide-react'
import { compile } from '@/lib/compile'

/**
 * Catches render-time errors thrown by the user's component so a bad keystroke
 * shows an inline message instead of blanking the whole playground.
 */
class PreviewBoundary extends Component<
  { children: ReactNode; resetKey: string; onError: (msg: string) => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidUpdate(prev: { resetKey: string }) {
    // A fresh compile (new key) clears the previous error state.
    if (prev.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false })
    }
  }

  componentDidCatch(err: unknown) {
    this.props.onError(err instanceof Error ? err.message : String(err))
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

export function LivePreview({
  source,
  debounceMs = 250,
  onRangeInput,
  onValidityChange,
  annotation,
  gentleErrors = false,
}: {
  source: string
  debounceMs?: number
  /** Fires when a range <input> inside the preview is dragged (slider steps). */
  onRangeInput?: () => void
  /** Reports whether the current source compiles + renders (Learn Mode gating). */
  onValidityChange?: (valid: boolean) => void
  /** Subtle caption shown over the stage, e.g. a fallback note for Learn Mode. */
  annotation?: string
  /** Use calm, beginner-friendly error copy instead of the raw red banner. */
  gentleErrors?: boolean
}) {
  const [Comp, setComp] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const versionRef = useRef(0)
  const [version, setVersion] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      const { Component: C, error: e } = compile(source)
      if (e) {
        setError(e)
        onValidityChange?.(false)
        return
      }
      setError(null)
      onValidityChange?.(true)
      setComp(() => C)
      versionRef.current += 1
      setVersion(versionRef.current)
    }, debounceMs)
    return () => clearTimeout(t)
  }, [source, debounceMs, onValidityChange])

  // Detect interaction with any range slider the user's component renders.
  useEffect(() => {
    if (!onRangeInput) return
    const stage = stageRef.current
    if (!stage) return
    const handler = (ev: Event) => {
      const t = ev.target as HTMLElement | null
      if (t && t.tagName === 'INPUT' && (t as HTMLInputElement).type === 'range') {
        onRangeInput()
      }
    }
    stage.addEventListener('input', handler)
    return () => stage.removeEventListener('input', handler)
  }, [onRangeInput])

  return (
    <div className="relative flex h-full w-full flex-col">
      <div ref={stageRef} className="ws-stage relative flex flex-1 items-center justify-center overflow-auto p-8 min-h-0">
        <div key={version} className="relative z-10 flex h-full w-full items-center justify-center">
          {Comp ? (
            <PreviewBoundary
              resetKey={String(version)}
              onError={(msg) => {
                setError(msg)
                onValidityChange?.(false)
              }}
            >
              <Comp />
            </PreviewBoundary>
          ) : null}
        </div>

        {annotation && !error && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10.5px] text-white/70 backdrop-blur-sm">
            <Sparkles size={10} className="text-violet-300/80" />
            {annotation}
          </div>
        )}
      </div>

      {error &&
        (gentleErrors ? (
          <div className="shrink-0 border-t border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <p className="m-0 text-[12px] font-medium text-amber-100/90">
                  The preview is waiting for valid code. Fix the highlighted issue, then continue.
                </p>
                <pre className="m-0 mt-1 whitespace-pre-wrap break-words font-mono text-[10.5px] leading-relaxed text-amber-200/60">
                  {error}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="shrink-0 border-t border-rose-500/20 bg-rose-500/10 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-400" />
              <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-rose-200/90">
                {error}
              </pre>
            </div>
          </div>
        ))}
    </div>
  )
}
