import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { softSpring, EASE_OUT } from './motion'

/**
 * Quiet, friendly confirmation shown when a step's task is satisfied. No
 * gamification — just a calm "you got it" before moving on.
 *
 * It arrives with a soft spring pop (rendered inside StepCard's AnimatePresence
 * so it can also ease out if the user edits back below the bar), and the
 * checkmark badge gives one gentle scale-settle to catch the eye without shouting.
 */
export function CompletionMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.16, ease: EASE_OUT } }}
      transition={softSpring}
      className="flex items-start gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2"
    >
      <motion.span
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ ...softSpring, delay: 0.06 }}
        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20"
      >
        <Check size={11} className="text-emerald-300" />
      </motion.span>
      <p className="m-0 text-[12.5px] leading-relaxed text-emerald-100/85">{message}</p>
    </motion.div>
  )
}
