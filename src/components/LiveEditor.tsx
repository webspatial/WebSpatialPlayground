import { useLayoutEffect, useMemo, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'

/**
 * A lightweight, dependency-free code editor: a transparent <textarea> layered
 * over a Prism-highlighted <pre>. The two share identical type metrics so the
 * caret tracks the highlighted glyphs exactly. This is the same technique used
 * by react-simple-code-editor — small, fast, good enough for live editing.
 */
export function LiveEditor({
  value,
  onChange,
  language = 'tsx',
}: {
  value: string
  onChange: (next: string) => void
  language?: string
}) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  const highlighted = useMemo(() => {
    const grammar = Prism.languages[language] ?? Prism.languages.tsx
    try {
      // Trailing newline keeps the final line's highlight box from collapsing.
      return Prism.highlight(value + '\n', grammar, language)
    } catch {
      return escapeHtml(value)
    }
  }, [value, language])

  // Keep the highlight layer scrolled in lockstep with the textarea.
  useLayoutEffect(() => {
    const ta = taRef.current
    const pre = preRef.current
    if (!ta || !pre) return
    const sync = () => {
      pre.scrollTop = ta.scrollTop
      pre.scrollLeft = ta.scrollLeft
    }
    ta.addEventListener('scroll', sync)
    return () => ta.removeEventListener('scroll', sync)
  }, [])

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
    padding: 16,
    border: 0,
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 12.5,
    lineHeight: 1.6,
    tabSize: 2,
    whiteSpace: 'pre',
    overflowWrap: 'normal',
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a12]">
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
