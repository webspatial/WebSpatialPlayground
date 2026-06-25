import { motion } from 'framer-motion'
import { EASE_OUT } from './motion'

/**
 * "Step N of M" with a quiet row of progress dots. Done steps and the current
 * step read as filled; upcoming steps stay secondary.
 *
 * Each dot animates its own width and colour, so advancing a step glides the
 * pill from one position to the next rather than redrawing — the small, telling
 * detail that makes progress feel continuous.
 */
export function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] font-medium tabular-nums text-white/45">
        Step {current + 1} of {total}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => {
          const state = i === current ? 'current' : i < current ? 'done' : 'upcoming'
          return (
            <motion.span
              key={i}
              className="h-1 rounded-full"
              initial={false}
              animate={{
                width: state === 'current' ? 16 : 6,
                backgroundColor:
                  state === 'current'
                    ? 'rgb(167 139 250)'
                    : state === 'done'
                      ? 'rgba(167, 139, 250, 0.5)'
                      : 'rgba(255, 255, 255, 0.15)',
              }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />
          )
        })}
      </div>
    </div>
  )
}
