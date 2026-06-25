import { useMemo, useState } from 'react'
import { snippets, docLinks } from '@/examples/snippets'
import { LiveEditor } from './LiveEditor'
import { LivePreview } from './LivePreview'
import { RuntimeBadge } from './RuntimeBanner'
import {
  BookOpen, Copy, Check, RotateCcw,
  ExternalLink, FileCode2, Play, Sparkles, ArrowUpRight,
} from 'lucide-react'

/**
 * Playground Mode: the open workbench for tinkering with a concept's example.
 * Which example is shown is chosen from the shared chapter rail (`activeId`), so
 * the playground stays in sync with Learn Mode — the live editor and live
 * WebSpatial preview otherwise work exactly as before.
 */
export function PlaygroundShell({ activeId }: { activeId: string }) {
  // Per-snippet editable source, seeded lazily from the snippet defaults. Kept
  // keyed by id so edits survive switching chapters and coming back.
  const [edited, setEdited] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const snippet = useMemo(
    () => snippets.find((s) => s.id === activeId) ?? snippets[0],
    [activeId],
  )
  const code = edited[snippet.id] ?? snippet.code

  const setCode = (next: string) =>
    setEdited((m) => ({ ...m, [snippet.id]: next }))

  const reset = () =>
    setEdited((m) => {
      const next = { ...m }
      delete next[snippet.id]
      return next
    })

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const isDirty = edited[snippet.id] != null && edited[snippet.id] !== snippet.code

  return (
    <>
      {/* ─── Split: editor | preview ─── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Editor */}
        <section className="flex min-h-0 flex-col border-b border-white/5 lg:w-[46%] lg:border-b-0 lg:border-r">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e18] px-4">
            <div className="flex items-center gap-2">
              <FileCode2 size={13} className="text-violet-400/80" />
              <span className="font-mono text-[11px] text-white/55">{snippet.id}.tsx</span>
              <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] text-violet-300/80">
                <Sparkles size={8} />editable · live
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isDirty && (
                <button onClick={reset}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-white/45 transition-all hover:bg-white/5 hover:text-white/75">
                  <RotateCcw size={11} />Reset
                </button>
              )}
              <button onClick={copy}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-white/45 transition-all hover:bg-white/5 hover:text-white/75">
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <LiveEditor value={code} onChange={setCode} language="tsx" />
          </div>
        </section>

        {/* Preview */}
        <section className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/5 bg-[#0e0e18] px-4">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/55">
              <Play size={11} className="text-violet-400" />
              Live preview — real WebSpatial render
            </span>
            <RuntimeBadge />
          </div>

          <div className="min-h-0 flex-1">
            <LivePreview source={code} annotation={snippet.previewNote} />
          </div>

          {/* Per-example explanation + doc deep-links */}
          <div className="shrink-0 border-t border-white/5 bg-[#0c0c14] px-5 py-4">
            <h2 className="text-sm font-semibold text-white">{snippet.title}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">{snippet.blurb}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {snippet.docs.map((d) => (
                <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300 transition-colors hover:bg-violet-500/20">
                  <BookOpen size={11} />{d.label}<ExternalLink size={9} className="opacity-50" />
                </a>
              ))}
              <a href={docLinks.llms} target="_blank" rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white/75">
                Full docs (llms.txt)<ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
