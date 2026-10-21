import type { InjectionKey, Ref } from 'vue'
import type { WaterfallRect } from './types'

export interface CellRegistration {
  element: HTMLElement
  setRect: (rect: WaterfallRect) => void
}

export interface WaterfallContext {
  columnWidth: Readonly<Ref<number | undefined>>
  register: (cell: CellRegistration) => () => void
  reflow: () => void
}

export const waterfallKey: InjectionKey<WaterfallContext> = Symbol('biu-waterfall')
