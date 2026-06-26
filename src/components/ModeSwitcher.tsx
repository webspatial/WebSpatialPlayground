import { GraduationCap, FlaskConical, Users } from 'lucide-react'

export type AppMode = 'learn' | 'playground' | 'community'

/**
 * Top-level switch between the guided Learn Mode, the open Playground Mode and
 * the Community showcase. A quiet segmented control — Learn is the default,
 * Playground is for users who want every example at once, and Community is a
 * gallery of demos built with WebSpatial.
 */
export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: AppMode
  onChange: (mode: AppMode) => void
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5">
      <Segment
        active={mode === 'learn'}
        onClick={() => onChange('learn')}
        icon={<GraduationCap size={13} />}
        label="Learn"
      />
      <Segment
        active={mode === 'playground'}
        onClick={() => onChange('playground')}
        icon={<FlaskConical size={13} />}
        label="Playground"
      />
      <Segment
        active={mode === 'community'}
        onClick={() => onChange('community')}
        icon={<Users size={13} />}
        label="Community"
      />
    </div>
  )
}

function Segment({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
        active
          ? 'bg-violet-500/20 text-violet-100 shadow-sm'
          : 'text-white/45 hover:text-white/75'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
