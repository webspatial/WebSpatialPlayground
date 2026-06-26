import { ArrowUpRight, Github, Plus, Users } from 'lucide-react'
import { communityDemos, communityRepo, type CommunityDemo } from '@/examples/community'

/**
 * Community Mode: a gallery of WebSpatial demos and apps built by the
 * community. Because a WebSpatial app is just a website, every tile is simply a
 * link to a live URL — the catalogue lives in `src/examples/community.ts` and
 * anyone can add to it by opening a pull request (the CTA below deep-links to
 * editing that file on GitHub).
 */
export function CommunityShell() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#0a0a0f]">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* ─── Intro ─── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
              <Users size={12} />
              Community Showcase
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Built with WebSpatial
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              A WebSpatial app is just a website — it loads in any browser and gains
              true depth on Apple Vision Pro / PICO OS&nbsp;6. Open any tile to try it
              live. Built something? Add it to the gallery with a single pull request.
            </p>
          </div>

          <a
            href={communityRepo.editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/15 px-3.5 py-2 text-sm font-medium text-violet-100 transition-colors hover:bg-violet-500/25"
          >
            <Plus size={15} />
            Add your demo
          </a>
        </div>

        {/* ─── Tiles ─── */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communityDemos.map((demo) => (
            <DemoTile key={demo.url} demo={demo} />
          ))}

          {/* A trailing "contribute" tile so the grid always ends on an invitation. */}
          <a
            href={communityRepo.editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center transition-colors hover:border-violet-500/40 hover:bg-violet-500/[0.06]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors group-hover:border-violet-500/40 group-hover:text-violet-200">
              <Plus size={20} />
            </span>
            <span className="text-sm font-medium text-white/70 group-hover:text-white">
              Add your demo
            </span>
            <span className="text-xs leading-relaxed text-white/40">
              Edit{' '}
              <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[11px] text-white/55">
                {communityRepo.filePath}
              </code>{' '}
              and open a pull request.
            </span>
          </a>
        </div>

        {/* ─── Footer note on how to contribute ─── */}
        <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60">
              <Github size={16} />
            </span>
            <div>
              <p className="text-sm font-medium text-white/85">Want to be featured?</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-white/50">
                Add an entry — a{' '}
                <span className="text-white/70">title</span>,{' '}
                <span className="text-white/70">url</span> and{' '}
                <span className="text-white/70">description</span> — to{' '}
                <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[11px] text-white/60">
                  {communityRepo.filePath}
                </code>{' '}
                and open a PR.
              </p>
            </div>
          </div>
          <a
            href={communityRepo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white/90"
          >
            <Github size={13} />
            Open the repo
            <ArrowUpRight size={12} className="opacity-60" />
          </a>
        </div>
      </div>
    </div>
  )
}

/** A single showcase tile — the whole card is a link to the live demo. */
function DemoTile({ demo }: { demo: CommunityDemo }) {
  let host = demo.url
  try {
    host = new URL(demo.url).hostname.replace(/^www\./, '')
  } catch {
    // Leave the raw url as the displayed host if it doesn't parse.
  }

  return (
    <a
      href={demo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[180px] flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-violet-500/[0.06] hover:shadow-lg hover:shadow-violet-500/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold leading-snug text-white">
          {demo.title}
        </h2>
        <ArrowUpRight
          size={16}
          className="mt-0.5 shrink-0 text-white/30 transition-colors group-hover:text-violet-300"
        />
      </div>

      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/55">
        {demo.description}
      </p>

      {demo.tags && demo.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {demo.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/45"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="truncate font-mono text-[11px] text-violet-300/70">
          {host}
        </span>
        {demo.author && (
          <span className="ml-3 shrink-0 text-[11px] text-white/35">
            by {demo.author}
          </span>
        )}
      </div>
    </a>
  )
}
