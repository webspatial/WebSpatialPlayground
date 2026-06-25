import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
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

export function LivePreview({ source, debounceMs = 250 }: { source: string; debounceMs?: number }) {
  const [Comp, setComp] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const versionRef = useRef(0)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      const { Component: C, error: e } = compile(source)
      if (e) {
        setError(e)
        return
      }
      setError(null)
      setComp(() => C)
      versionRef.current += 1
      setVersion(versionRef.current)
    }, debounceMs)
    return () => clearTimeout(t)
  }, [source, debounceMs])

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="ws-stage relative flex flex-1 items-center justify-center overflow-auto p-8 min-h-0">
        <div key={version} className="relative z-10 flex h-full w-full items-center justify-center">
          {Comp ? (
            <PreviewBoundary resetKey={String(version)} onError={setError}>
              <Comp />
            </PreviewBoundary>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="shrink-0 border-t border-rose-500/20 bg-rose-500/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-400" />
            <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-rose-200/90">
              {error}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
