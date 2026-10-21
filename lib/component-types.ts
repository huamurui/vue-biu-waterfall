import type { WaterfallOptions } from './types'

export interface WaterfallContainerProps extends WaterfallOptions {
  /** Suspend reach-end notifications while a page is loading. */
  loading?: boolean
  /** Set false after the last page. */
  hasMore?: boolean
  /** Distance in pixels at which the end sentinel becomes visible. */
  threshold?: number
  /** IntersectionObserver root; null uses the viewport. */
  scrollRoot?: HTMLElement | null
}

export interface WaterfallCellProps {
  /** Pass both dimensions to reserve a fixed aspect ratio. */
  width?: number
  height?: number
}

export interface WaterfallContainerInstance {
  /** Batch a new measurement and layout into the next animation frame. */
  reflow: () => void
}
