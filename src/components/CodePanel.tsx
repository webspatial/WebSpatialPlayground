import { useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'

/**
 * Read-only, syntax-highlighted view of the REAL source for the current example.
 * The text is regenerated from the live control values, so it always reflects
 * what the real WebSpatial component is rendering. (Rendering is driven by the
 * real component + controls — not by transpiling this text.)
 */
export function CodePanel({ code, language = 'tsx' }: { code: string; language?: string }) {
  const html = useMemo(() => {
    const grammar = Prism.languages[language] ?? Prism.languages.tsx
    try {
      return Prism.highlight(code, grammar, language)
    } catch {
      return code.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
    }
  }, [code, language])

  return (
    <pre className="code-block m-0 text-[12.5px] leading-relaxed">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  )
}
