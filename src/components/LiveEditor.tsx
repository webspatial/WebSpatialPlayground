import { useLayoutEffect, useMemo, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'

// Type metrics shared by the textarea, the highlight layer and the line bands.
// fontSize × lineHeight = 12.5 × 1.6 = 20px per line; 16px top/left padding.
const FONT_SIZE = 12.5
const LINE_HEIGHT = 1.6
const LINE_PX = FONT_SIZE * LINE_HEIGHT
const PAD = 16

/**
 * A lightweight, dependency-free code editor: a transparent <textarea> layered
 * over a Prism-highlighted <pre>. The two share identical type metrics so the
 * caret tracks the highlighted glyphs exactly. This is the same technique used
 * by react-simple-code-editor — small, fast, good enough for live editing.
 *
 * Learn Mode adds a third layer beneath the text: soft bands that spotlight the
 * exact lines a tutorial step is teaching (`highlightAnchors`).
 */
export function LiveEditor({
  value,
  onChange,
  language = 'tsx',
  highlightAnchors,
}: {
  value: string
  onChange: (next: string) => void
  language?: string
  /** Substrings; every line containing one is highlighted for the current step. */
  highlightAnchors?: string[]
}) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const bandsRef = useRef<HTMLDivElement>(null)

  const highlighted = useMemo(() => {
    const grammar = Prism.languages[language] ?? Prism.languages.tsx
    try {
      // Trailing newline keeps the final line's highlight box from collapsing.
      return Prism.highlight(value + '\n', grammar, language)
    } catch {
      return escapeHtml(value)
    }
  }, [value, language])

  // Lines (0-based) that match any anchor, for the spotlight bands.
  const bandLines = useMemo(() => {
    if (!highlightAnchors?.length) return []
    const lines = value.split('\n')
    const hits: number[] = []
    lines.forEach((line, i) => {
      if (highlightAnchors.some((a) => line.includes(a))) hits.push(i)
    })
    return hits
  }, [value, highlightAnchors])

  // Keep the highlight layers scrolled in lockstep with the textarea.
  useLayoutEffect(() => {
    const ta = taRef.current
    const pre = preRef.current
    if (!ta || !pre) return
    const sync = () => {
      pre.scrollTop = ta.scrollTop
      pre.scrollLeft = ta.scrollLeft
      if (bandsRef.current) {
        bandsRef.current.style.transform = `translateY(${-ta.scrollTop}px)`
      }
    }
    sync()
    ta.addEventListener('scroll', sync)
    return () => ta.removeEventListener('scroll', sync)
  }, [])

  // Re-sync band offset when the highlighted lines change (a new step).
  useLayoutEffect(() => {
    const ta = taRef.current
    if (ta && bandsRef.current) {
      bandsRef.current.style.transform = `translateY(${-ta.scrollTop}px)`
    }
  }, [bandLines])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart: s, selectionEnd: en } = ta
      const next = value.slice(0, s) + '  ' + value.slice(en)
      onChange(next)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 2
      })
    }
  }

  const shared: React.CSSProperties = {
    margin: 0,
    padding: PAD,
    border: 0,
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    tabSize: 2,
    whiteSpace: 'pre',
    overflowWrap: 'normal',
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a12]">
      {/* Step spotlight: soft bands behind the text marking the current lines. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div ref={bandsRef} className="absolute inset-x-0 top-0">
          {bandLines.map((line) => (
            <div
              key={line}
              className="absolute inset-x-0 border-l-2 border-violet-400/70 bg-violet-400/10"
              style={{ top: PAD + line * LINE_PX, height: LINE_PX }}
            />
          ))}
        </div>
      </div>

      {/* No `language-*` class here: a global `pre[class*="language-"]` rule
          carries !important font metrics that would desync this overlay from
          the textarea. The `.token.*` colour rules apply globally regardless. */}
      <pre
        ref={preRef}
        aria-hidden
        className="absolute inset-0 overflow-auto pointer-events-none"
        style={shared}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="absolute inset-0 resize-none overflow-auto bg-transparent text-transparent caret-violet-300 outline-none"
        style={{ ...shared, WebkitTextFillColor: 'transparent' }}
      />
    </div>
  )
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
