import type { Control, ControlValues } from '@/examples/types'

/**
 * Renders editable controls bound to a real WebSpatial component's props / CSS
 * custom properties. Changing any control updates the live preview instantly.
 */
export function ControlsPanel({
  controls,
  values,
  onChange,
}: {
  controls: Control[]
  values: ControlValues
  onChange: (id: string, value: string | number | boolean) => void
}) {
  if (controls.length === 0) return null

  return (
    <div className="px-4 py-3 border-b border-white/5 bg-[#0c0c14] flex flex-col gap-3 shrink-0">
      {controls.map((c) => {
        const value = values[c.id]
        return (
          <label key={c.id} className="flex flex-col gap-1.5">
            <span className="text-[10px] text-violet-300/70 font-semibold uppercase tracking-wide flex items-center justify-between">
              <span>{c.label}</span>
              {(c.type === 'slider') && (
                <span className="text-violet-200/90 font-mono normal-case tracking-normal">
                  {String(value)}
                  {c.unit ?? ''}
                </span>
              )}
            </span>

            {c.type === 'slider' && (
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={Number(value)}
                onChange={(e) => onChange(c.id, Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            )}

            {c.type === 'select' && (
              <select
                value={String(value)}
                onChange={(e) => onChange(c.id, e.target.value)}
                className="px-3 py-2 rounded-lg bg-black/30 border border-violet-500/20 text-xs text-white/80 font-mono focus:outline-none focus:border-violet-500/50 transition-colors"
              >
                {c.options?.map((o) => (
                  <option key={o.value} value={o.value} className="bg-[#0c0c14]">
                    {o.label ?? o.value}
                  </option>
                ))}
              </select>
            )}

            {c.type === 'text' && (
              <>
                <input
                  type="text"
                  list={`dl-${c.id}`}
                  value={String(value)}
                  placeholder={c.placeholder}
                  onChange={(e) => onChange(c.id, e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/30 border border-violet-500/20 text-xs text-white/80 font-mono focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                {c.suggestions && (
                  <datalist id={`dl-${c.id}`}>
                    {c.suggestions.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                )}
                {c.hint && <span className="text-[10px] text-white/35">{c.hint}</span>}
              </>
            )}

            {c.type === 'color' && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={String(value)}
                  onChange={(e) => onChange(c.id, e.target.value)}
                  className="w-9 h-8 rounded-md bg-transparent border border-white/10 cursor-pointer"
                />
                <span className="text-xs text-white/70 font-mono">{String(value)}</span>
              </div>
            )}

            {c.type === 'toggle' && (
              <button
                type="button"
                onClick={() => onChange(c.id, !value)}
                className={`w-fit px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                  value
                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {value ? 'true' : 'false'}
              </button>
            )}
          </label>
        )
      })}
    </div>
  )
}
