import type { ReactNode } from 'react'

/**
 * A control bound to a REAL WebSpatial component's prop / CSS custom property.
 * Editing a control updates the live preview (the real precompiled component)
 * instantly. The code panel is generated from the same values so the displayed
 * source always reflects what is rendered.
 */
export type ControlType = 'slider' | 'select' | 'text' | 'color' | 'toggle'

export interface SelectOption {
  value: string
  label?: string
}

export interface Control {
  id: string
  label: string
  type: ControlType
  default: string | number | boolean
  /** slider / number */
  min?: number
  max?: number
  step?: number
  unit?: string
  /** select */
  options?: SelectOption[]
  /** text */
  placeholder?: string
  /** text datalist suggestions */
  suggestions?: string[]
  hint?: string
}

export type ControlValues = Record<string, string | number | boolean>

export interface Example {
  id: string
  title: string
  subtitle: string
  docsUrl: string
  description: string
  tags: string[]
  /** Editable controls bound to the real component below. */
  controls: Control[]
  /** Renders the REAL, precompiled WebSpatial component for the given values. */
  render: (values: ControlValues) => ReactNode
  /** Generates the real source code reflecting the current control values. */
  code: (values: ControlValues) => string
  /** Language label for the code panel. */
  language?: string
}

export interface CategoryDef {
  id: string
  name: string
  iconName: string
  examples: Example[]
}

export function controlDefaults(controls: Control[]): ControlValues {
  const out: ControlValues = {}
  for (const c of controls) out[c.id] = c.default
  return out
}
