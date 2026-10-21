import { describe, expect, it } from 'vitest'
import { calculateLayout, resolveLayout } from '../lib/utils/calculate'

describe('resolveLayout', () => {
  it('fits responsive columns and stretches them to the container width', () => {
    expect(resolveLayout(752)).toEqual({
      columns: 3, columnWidth: 240, columnGap: 16, rowGap: 16, offset: 0, width: 752,
    })
    expect(resolveLayout(751)).toMatchObject({ columns: 2, columnWidth: 367.5 })
    expect(resolveLayout(1000)).toMatchObject({ columns: 3, columnWidth: 968 / 3 })
  })

  it('supports CSS-order row/column gaps and responsive column limits', () => {
    expect(resolveLayout(1000, { gap: [12, 20], maxColumns: 2 })).toMatchObject({
      columns: 2, columnWidth: 490, rowGap: 12, columnGap: 20,
    })
    expect(resolveLayout(600, { minColumns: 4 })).toMatchObject({ columns: 4, columnWidth: 138 })
    expect(resolveLayout(600, { minColumns: 4, maxColumns: 2 }).columns).toBe(4)
  })

  it('lets explicit columns override automatic bounds', () => {
    expect(resolveLayout(1000, { columns: 4, maxColumns: 2 }).columns).toBe(4)
    expect(resolveLayout(1000, { columns: 2, minColumns: 4 }).columns).toBe(2)
    expect(resolveLayout(1000, { columns: 2.9 }).columns).toBe(2)
  })

  it('keeps tiny, zero, and invalid container widths finite and within their bounds', () => {
    for (const width of [0, 0.1, 1, 10, -10, NaN, Infinity, -Infinity]) {
      const layout = resolveLayout(width, { columns: 100, minColumns: 100, gap: 100 })
      expect(layout.columns).toBe(1)
      expect(layout.columnWidth).toBe(Number.isFinite(width) && width >= 0 ? width : 0)
    }
    expect(resolveLayout(100, { columns: 100, gap: 16 })).toMatchObject({ columns: 6, columnWidth: 20 / 6 })
  })

  it('uses safe defaults for invalid options and preserves zero gaps', () => {
    for (const invalid of [0, -1, NaN, Infinity, -Infinity]) {
      expect(resolveLayout(752, {
        columnWidth: invalid, columns: invalid, minColumns: invalid, maxColumns: invalid,
      })).toEqual(resolveLayout(752))
    }
    expect(resolveLayout(752, { gap: [-1, NaN] })).toEqual(resolveLayout(752))
    expect(resolveLayout(480, { gap: 0 })).toMatchObject({ columns: 2, columnWidth: 240, rowGap: 0, columnGap: 0 })
  })

  it('avoids non-finite results for very large finite dimensions', () => {
    for (const options of [{}, { gap: Number.MAX_VALUE }, { columns: Number.MAX_VALUE, gap: 0 }]) {
      const layout = resolveLayout(Number.MAX_VALUE, options)
      expect(Object.values(layout).every(Number.isFinite)).toBe(true)
      expect(layout.columns).toBeGreaterThanOrEqual(1)
      expect(layout.columnWidth).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('calculateLayout', () => {
  it('places items in the shortest column, breaking ties to the left', () => {
    const layout = calculateLayout([100, 50, 70, 20, 10], 320, { columns: 3, gap: 10 })
    expect(layout.rects).toEqual([
      { left: 0, top: 0, width: 100, height: 100, column: 0 },
      { left: 110, top: 0, width: 100, height: 50, column: 1 },
      { left: 220, top: 0, width: 100, height: 70, column: 2 },
      { left: 110, top: 60, width: 100, height: 20, column: 1 },
      { left: 220, top: 80, width: 100, height: 10, column: 2 },
    ])
    expect(layout.height).toBe(100)
    expect(calculateLayout([10, 10, 10], 210, { columns: 2, gap: 10 }).rects.map(rect => rect.column))
      .toEqual([0, 1, 0])
  })

  it('does not add a trailing row gap or a gap to an empty layout', () => {
    expect(calculateLayout([], 100).height).toBe(0)
    expect(calculateLayout([], 100).rects).toEqual([])
    expect(calculateLayout([20, 30], 100, { gap: [7, 15] }).height).toBe(57)
    expect(calculateLayout([0], 100).height).toBe(0)
  })

  it('normalizes invalid heights without mutating input', () => {
    const heights = Object.freeze([30, NaN, -5, Infinity, 0])
    const options = Object.freeze({ columns: 1, gap: Object.freeze([5, 10] as const) })
    const layout = calculateLayout(heights, 100, options)
    expect(layout.rects.map(rect => rect.height)).toEqual([30, 0, 0, 0, 0])
    expect(layout.rects.map(rect => rect.top)).toEqual([0, 35, 40, 45, 50])
    expect(heights).toEqual([30, NaN, -5, Infinity, 0])
  })

  it('handles zero-height ties and never divides by zero in hidden containers', () => {
    const layout = calculateLayout([0, 0, 0], 0, { columns: 3, gap: 0 })
    expect(layout.height).toBe(0)
    expect(layout.rects.map(rect => rect.column)).toEqual([0, 0, 0])
    expect(layout.rects.every(rect => Object.values(rect).every(Number.isFinite))).toBe(true)
    expect(calculateLayout([0, 10, 0, 20], 200, { columns: 2, gap: 0 }).rects.map(rect => rect.column))
      .toEqual([0, 0, 1, 1])
  })

  it('allocates only useful columns for huge requested column counts', () => {
    const layout = calculateLayout([10, 20], Number.MAX_VALUE, { columns: Number.MAX_VALUE, gap: 0 })
    expect(layout.rects.map(rect => rect.column)).toEqual([0, 1])
    expect(layout.height).toBe(20)
    const tall = calculateLayout([Number.MAX_VALUE, Number.MAX_VALUE], 100, { columns: 1 })
    expect(tall.height).toBe(Number.MAX_VALUE)
    expect(tall.rects.every(rect => Object.values(rect).every(Number.isFinite))).toBe(true)
  })

  it('matches a simple shortest-column reference for a large varied collection', () => {
    const heights = Array.from({ length: 10_000 }, (_, i) => (i * 37) % 271)
    const layout = calculateLayout(heights, 1000, { columns: 7, gap: [13, 17] })
    const nextTops = Array<number>(7).fill(0)
    heights.forEach((height, index) => {
      const column = nextTops.indexOf(Math.min(...nextTops))
      expect(layout.rects[index]).toMatchObject({ top: nextTops[column], height, column })
      nextTops[column] += height + 13
    })
    expect(layout.height).toBe(Math.max(...nextTops) - 13)
  })
})
