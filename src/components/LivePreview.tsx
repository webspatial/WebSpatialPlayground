import { Component, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, Sparkles } from 'lucide-react'
import { compile } from '@/lib/compile'
import { detectRuntime } from '@/lib/runtime'

// In a spatial runtime every preview swap tears down and re-creates native
// spatialized elements — much heavier than a DOM update, and typing on a
// headset is slow enough that a short debounce fires between individual
// keystrokes. Give the runtime a longer idle window before recompiling.
const DEFAULT_DEBOUNCE_MS = detectRuntime().isSpatial ? 800 : 250

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
  debounceMs = DEFAULT_DEBOUNCE_MS,
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
  // The text field that held focus just before a preview swap committed, so
  // focus can be handed back if the swap steals it (see below).
  const focusSnapshot = useRef<{
    el: HTMLTextAreaElement | HTMLInputElement
    start: number
    end: number
  } | null>(null)

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
      const active = document.activeElement
      focusSnapshot.current =
        active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement
          ? { el: active, start: active.selectionStart ?? 0, end: active.selectionEnd ?? 0 }
          : null
      setComp(() => C)
      versionRef.current += 1
      setVersion(versionRef.current)
    }, debounceMs)
    return () => clearTimeout(t)
  }, [source, debounceMs, onValidityChange])

  // Swapping in a freshly compiled component unmounts and remounts the whole
  // preview subtree. In a WebSpatial runtime that destroys and re-creates
  // native spatialized elements, and the runtime can move input focus to the
  // new spatial content — so typing in the editor loses its caret 250–800ms
  // after each keystroke. If a text field was focused when the swap committed
  // and focus fell to nowhere, give it back. The extra rAF + timeout passes
  // catch the runtime stealing focus a beat after the DOM swap.
  useLayoutEffect(() => {
    const snap = focusSnapshot.current
    if (!snap) return
    focusSnapshot.current = null
    const restore = () => {
      const active = document.activeElement
      const focusLost = !active || active === document.body
      if (focusLost && snap.el.isConnected) {
        snap.el.focus({ preventScroll: true })
        try {
          snap.el.setSelectionRange(snap.start, snap.end)
        } catch {
          // input types without selection support
        }
      }
    }
    restore()
    const raf = requestAnimationFrame(restore)
    const t = setTimeout(restore, 120)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [version])

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
        {/* No key here: each compile yields a new component identity, so the
            user subtree already remounts on its own. Keying the wrapper by
            version would needlessly destroy this stable container too. */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
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
