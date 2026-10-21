/** Responsive masonry sizing. All dimensions are CSS pixels. */
export interface WaterfallOptions {
  /** Preferred minimum width used to choose a responsive column count. Default: 240. */
  columnWidth?: number
  /** Explicit column count, overriding responsive min/max bounds when space allows. */
  columns?: number
  /** Minimum responsive column count, when space allows. Default: 1. */
  minColumns?: number
  /** Maximum responsive column count. Default: unlimited. */
  maxColumns?: number
  /** A uniform gap, or [rowGap, columnGap], matching CSS gap order. Default: 16. */
  gap?: number | readonly [number, number]
}

export interface ResolvedLayout {
  columns: number
  columnWidth: number
  columnGap: number
  rowGap: number
  offset: number
  width: number
}

export interface WaterfallRect {
  left: number
  top: number
  width: number
  height: number
  column: number
}

export interface WaterfallLayout extends ResolvedLayout {
  height: number
  rects: WaterfallRect[]
}
