import { backExample, transformExample, backgroundMaterialExample, depthExample } from './css-api'
import { jsxMarkerExample, modelExample, realityExample } from './react-components'
import {
  spatialTapExample,
  spatialDragExample,
  spatialRotateExample,
  spatialMagnifyExample,
} from './event-api'
import { initSceneExample, useMetricsExample, userAgentExample, manifestExample } from './js-api'
import type { CategoryDef } from './types'

export const categories: CategoryDef[] = [
  {
    id: 'css-api',
    name: 'CSS API',
    iconName: 'Paintbrush',
    examples: [backExample, transformExample, backgroundMaterialExample, depthExample],
  },
  {
    id: 'react-components',
    name: 'React Components',
    iconName: 'Component',
    examples: [jsxMarkerExample, modelExample, realityExample],
  },
  {
    id: 'event-api',
    name: 'Event API',
    iconName: 'Hand',
    examples: [spatialTapExample, spatialDragExample, spatialRotateExample, spatialMagnifyExample],
  },
  {
    id: 'js-api',
    name: 'JS / Manifest API',
    iconName: 'Code',
    examples: [initSceneExample, useMetricsExample, userAgentExample, manifestExample],
  },
]

export type { Example, Control, ControlValues, CategoryDef } from './types'
export { controlDefaults } from './types'
