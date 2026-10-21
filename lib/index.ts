import type { ComponentOptionsMixin, DefineComponent } from 'vue'
import Cell from './WaterfallCell.vue'
import Container from './WaterfallContainer.vue'
import type { WaterfallCellProps, WaterfallContainerProps, WaterfallContainerInstance } from './component-types'
import type { WaterfallLayout } from './types'

// Keep the public declarations compatible with Vue 3.3. Generated SFC types
// otherwise expose the additional DefineComponent parameters of the build's Vue.
type ContainerComponent = DefineComponent<
  WaterfallContainerProps,
  WaterfallContainerInstance,
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  {
    layout: (layout: WaterfallLayout) => void
    'reach-end': (layout: WaterfallLayout) => void
  }
>

export const WaterfallCell = Cell as unknown as DefineComponent<WaterfallCellProps>
export const WaterfallContainer = Container as unknown as ContainerComponent
export { calculateLayout, resolveLayout } from './utils/calculate'
export type { WaterfallOptions, ResolvedLayout, WaterfallRect, WaterfallLayout } from './types'
export type { WaterfallCellProps, WaterfallContainerProps, WaterfallContainerInstance } from './component-types'
