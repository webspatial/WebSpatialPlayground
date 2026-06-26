import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check, Circle, ChevronRight, Globe, Headphones, AlertTriangle, Info,
} from 'lucide-react'

/** One row in the setup checklist, with its live validation state. */
export interface ChecklistItem {
  id: string
  title: string
  /** Satisfied by the current files (code steps) — undefined for manual steps. */
  satisfied: boolean
  /** Manual / observational step (no file validation). */
  manual: boolean
  /** The step the user is on right now. */
  active: boolean
}

/**
 * Story 0's right-hand stage. Where the code lessons render a live WebSpatial
 * component, setup has nothing to render yet — so this shows a calm setup
 * *checklist* instead: live validation status per step, the browser-fallback vs
 * WebSpatial-Runtime mental model, and (collapsed) platform notes + the
 * troubleshooting recap. The always-visible "Current SDK" note keeps the lesson
 * honest about what the installed SDK actually ships.
 */
export function SetupChecklist({
  items,
  isSpatial,
  currentSdkNote,
  troubleshooting,
}: {
  items: ChecklistItem[]
  /** Whether a WebSpatial Runtime is active (drives the "Spatial runtime" state). */
  isSpatial: boolean
  currentSdkNote: string
  troubleshooting: string[]
}) {
  const checkable = items.filter((i) => !i.manual)
  const done = checkable.filter((i) => i.satisfied).length

  return (
    <div className="ws-stage flex h-full w-full flex-col gap-4 overflow-auto p-5">
      {/* Setup status header */}
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-[13px] font-semibold text-white/85">Setup checklist</h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10.5px] text-white/55">
          {done}/{checkable.length} validated
        </span>
      </div>

      {/* Runtime mental model — the three states Story 0 teaches. */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <StateChip
          icon={<Globe size={13} />}
          label="Browser fallback"
          detail="Renders as a normal website"
          tone="ready"
        />
        <StateChip
          icon={<Headphones size={13} />}
          label="Spatial runtime"
          detail={isSpatial ? 'Active — spatial enabled' : 'Needs WebSpatial Runtime'}
          tone={isSpatial ? 'ready' : 'idle'}
        />
        <StateChip
          icon={<AlertTriangle size={13} />}
          label="Boot failed"
          detail="onError shows a fallback"
          tone="muted"
        />
      </div>

      {/* The live, per-step checklist */}
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((item) => {
          const checked = !item.manual && item.satisfied
          return (
            <li
              key={item.id}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors ${
                item.active ? 'bg-violet-500/10' : ''
              }`}
            >
              <span className="shrink-0">
                {checked ? (
                  <Check size={14} className="text-emerald-400" />
                ) : item.manual ? (
                  <Circle size={11} className="text-white/25" />
                ) : (
                  <Circle size={11} className="text-white/30" />
                )}
              </span>
              <span
                className={`flex-1 leading-snug ${
                  checked ? 'text-white/70' : item.active ? 'text-white/85' : 'text-white/45'
                }`}
              >
                {item.title}
              </span>
              {item.manual && (
                <span className="shrink-0 rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white/30">
                  manual
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {/* Platform-specific notes — collapsed by default so the lesson stays calm. */}
      <Disclosure title="Platform preview notes">
        <p className="m-0 text-[12px] leading-relaxed text-white/55">
          <span className="font-medium text-white/70">Path A — Direct runtime preview.</span>{' '}
          When the target browser/runtime can open your dev server URL, just open it there.
        </p>
        <p className="m-0 mt-2 text-[12px] leading-relaxed text-white/55">
          <span className="font-medium text-white/70">Path B — Builder packaged preview.</span>{' '}
          When the platform needs a packaged app shell, use the Builder, e.g.{' '}
          <code className="font-mono text-[11px] text-emerald-200/80">
            webspatial-builder run --base="http://localhost:5173/"
          </code>
          . Use the current Builder command from your installed docs.
        </p>
      </Disclosure>

      {/* Troubleshooting recap — the content of the final step, available any time. */}
      <Disclosure title="Troubleshooting checklist">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {troubleshooting.map((t) => (
            <li key={t} className="flex items-start gap-2 text-[12px] leading-snug text-white/55">
              <Check size={12} className="mt-0.5 shrink-0 text-white/30" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Disclosure>

      {/* Current-SDK honesty note — always visible. */}
      <div className="mt-auto flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2.5">
        <Info size={13} className="mt-0.5 shrink-0 text-amber-300/80" />
        <div>
          <p className="m-0 text-[11px] font-medium uppercase tracking-wide text-amber-200/70">
            Current SDK note
          </p>
          <p className="m-0 mt-1 text-[12px] leading-relaxed text-amber-100/70">{currentSdkNote}</p>
        </div>
      </div>
    </div>
  )
}

/** One of the three runtime-state chips. */
function StateChip({
  icon,
  label,
  detail,
  tone,
}: {
  icon: React.ReactNode
  label: string
  detail: string
  tone: 'ready' | 'idle' | 'muted'
}) {
  const styles =
    tone === 'ready'
      ? 'border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200/90'
      : tone === 'idle'
        ? 'border-sky-400/20 bg-sky-400/[0.06] text-sky-100/80'
        : 'border-white/10 bg-white/[0.03] text-white/55'
  return (
    <div className={`flex flex-col gap-1 rounded-lg border px-2.5 py-2 ${styles}`}>
      <span className="flex items-center gap-1.5 text-[11.5px] font-medium">
        {icon}
        {label}
      </span>
      <span className="text-[10.5px] leading-snug opacity-70">{detail}</span>
    </div>
  )
}

/** A calm, collapsed-by-default expandable section. */
function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-white/65 transition-colors hover:text-white/85"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.18 }} className="inline-flex">
          <ChevronRight size={13} className="text-white/40" />
        </motion.span>
        {title}
      </button>
      {open && <div className="px-3 pb-3 pt-0.5">{children}</div>}
    </div>
  )
}
