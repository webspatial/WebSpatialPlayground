import { GraduationCap, FlaskConical } from 'lucide-react'
import { chapters } from '@/tutorial/chapters'
import type { AppMode } from './ModeSwitcher'

/**
 * The shared table of contents down the left edge. It lists every WebSpatial
 * concept once, in teaching order, so the user can jump straight to chapter 2 or
 * 3 in either mode — and, because Learn and Playground navigate from the very
 * same list, picking a concept here keeps their place when they flip between
 * learning it and tinkering with it.
 *
 * Each row shows which approaches a concept offers: a cap when a guided lesson
 * exists, a flask for the playground example. The icon matching the current mode
 * lights up so it's clear what selecting the row will open.
 */
export function ChapterRail({
  activeId,
  mode,
  onSelect,
}: {
  activeId: string
  mode: AppMode
  onSelect: (id: string) => void
}) {
  return (
    <nav className="flex w-52 shrink-0 flex-col overflow-y-auto border-r border-white/5 bg-[#0b0b13] px-2.5 py-3">
      <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-white/30">
        Chapters
      </p>
      <div className="flex flex-col gap-0.5">
        {chapters.map((ch, i) => {
          const active = ch.id === activeId
          const hasLesson = !!ch.lesson || !!ch.setup
          const hasDemo = !!ch.snippet
          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={`group flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                active ? 'bg-violet-500/15' : 'hover:bg-white/[0.04]'
              }`}
            >
              <span
                className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-semibold tabular-nums ${
                  active ? 'bg-violet-500/30 text-violet-100' : 'bg-white/5 text-white/40'
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[12px] font-medium leading-snug ${
                    active ? 'text-white' : 'text-white/55 group-hover:text-white/80'
                  }`}
                >
                  {ch.title}
                </span>
                <span className="mt-1 flex items-center gap-1.5">
                  <Tag
                    icon={<GraduationCap size={10} />}
                    label="Lesson"
                    on={hasLesson}
                    lit={active && mode === 'learn' && hasLesson}
                  />
                  <Tag
                    icon={<FlaskConical size={10} />}
                    label="Demo"
                    on={hasDemo}
                    lit={active && mode === 'playground' && hasDemo}
                  />
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/** A small availability chip: present when `on`, emphasised when `lit`. */
function Tag({
  icon,
  label,
  on,
  lit,
}: {
  icon: React.ReactNode
  label: string
  on: boolean
  lit: boolean
}) {
  if (!on) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] text-white/20">
        {icon}
        <span className="opacity-70">soon</span>
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[9px] transition-colors ${
        lit ? 'text-violet-300' : 'text-white/35'
      }`}
    >
      {icon}
      {label}
    </span>
  )
}
