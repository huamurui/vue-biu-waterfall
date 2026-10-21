import type { ResolvedLayout, WaterfallLayout, WaterfallOptions, WaterfallRect } from '../types'

const DEFAULT_COLUMN_WIDTH = 240
const DEFAULT_GAP = 16

function nonNegative(value: number, fallback = 0): number {
  return Number.isFinite(value) && value >= 0 ? value : fallback
}

function positiveInteger(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) && value >= 1
    ? Math.min(Math.floor(value), Number.MAX_SAFE_INTEGER)
    : fallback
}

// Splitting the numerator prevents width + gap overflowing for very large inputs.
function fittingColumns(width: number, columnWidth: number, gap: number): number {
  const stride = columnWidth + gap
  return Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(width / stride + gap / stride)))
}

/** Resolve responsive columns against the container's content width, in pixels. */
export function resolveLayout(width: number, options: WaterfallOptions = {}): ResolvedLayout {
  const availableWidth = nonNegative(width)
  const requestedWidth = options.columnWidth !== undefined
    && Number.isFinite(options.columnWidth) && options.columnWidth > 0
    ? options.columnWidth
    : DEFAULT_COLUMN_WIDTH
  const gap = options.gap ?? DEFAULT_GAP
  const rowGap = nonNegative(typeof gap === 'number' ? gap : gap[0], DEFAULT_GAP)
  const columnGap = nonNegative(typeof gap === 'number' ? gap : gap[1], DEFAULT_GAP)
  const minColumns = positiveInteger(options.minColumns, 1)
  const maxColumns = Math.max(minColumns, positiveInteger(options.maxColumns, Number.MAX_SAFE_INTEGER))
  const automaticColumns = Math.min(maxColumns, Math.max(minColumns,
    fittingColumns(availableWidth, requestedWidth, columnGap)))
  const requestedColumns = positiveInteger(options.columns, automaticColumns)
  // Explicit/minimum column counts still respect the available space. A column
  // is at least 1px wide, except when the entire container is narrower than 1px.
  const columns = Math.min(requestedColumns, fittingColumns(availableWidth, 1, columnGap))
  const columnWidth = Math.max(0, (availableWidth - columnGap * (columns - 1)) / columns)

  return { columns, columnWidth, columnGap, rowGap, offset: 0, width: availableWidth }
}

interface Column {
  index: number
  height: number
}

function comesBefore(a: Column, b: Column): boolean {
  return a.height < b.height || (a.height === b.height && a.index < b.index)
}

function finiteSum(a: number, b: number): number {
  return Math.min(a + b, Number.MAX_VALUE)
}

/**
 * Place measured item heights in the shortest column without mutating inputs.
 * Ties go to the leftmost column. A heap keeps placement O(n log columns), and
 * only columns that could receive an item are allocated.
 */
export function calculateLayout(
  heights: readonly number[],
  width: number,
  options: WaterfallOptions = {},
): WaterfallLayout {
  const resolved = resolveLayout(width, options)
  const heap: Column[] = Array.from({ length: Math.min(resolved.columns, heights.length) },
    (_, index) => ({ index, height: 0 }))
  const rects: WaterfallRect[] = []
  let height = 0

  for (const measuredHeight of heights) {
    const column = heap[0]!
    const itemHeight = nonNegative(measuredHeight)
    const bottom = finiteSum(column.height, itemHeight)
    rects.push({
      left: column.index * resolved.columnWidth + column.index * resolved.columnGap,
      top: column.height,
      width: resolved.columnWidth,
      height: itemHeight,
      column: column.index,
    })
    height = Math.max(height, bottom)
    column.height = finiteSum(bottom, resolved.rowGap)

    // Only the root increased; restore the heap with a single sift-down.
    let parent = 0
    while (parent * 2 + 1 < heap.length) {
      let child = parent * 2 + 1
      const right = child + 1
      if (right < heap.length && comesBefore(heap[right]!, heap[child]!)) child = right
      if (!comesBefore(heap[child]!, column)) break
      heap[parent] = heap[child]!
      parent = child
    }
    heap[parent] = column
  }

  return { ...resolved, height, rects }
}
