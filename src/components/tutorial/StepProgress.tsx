/**
 * "Step N of M" with a quiet row of progress dots. Done steps and the current
 * step read as filled; upcoming steps stay secondary.
 */
export function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] font-medium tabular-nums text-white/45">
        Step {current + 1} of {total}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === current
                ? 'w-4 bg-violet-400'
                : i < current
                  ? 'w-1.5 bg-violet-400/50'
                  : 'w-1.5 bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
