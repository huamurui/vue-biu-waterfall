// we wil get single cell's adapted width and column count of layout here
export default function getLayoutStrategy(width: number, options: WaterfallConfig) {
  let count = width / options.lineGap
  let slotWidth
  if (options.singleMaxWidth >= width) {
    count = 1
    slotWidth = Math.max(width, options.minLineGap)
  } else {
    let maxContentWidth = options.maxLineGap * ~~count
    let minGreedyContentWidth = options.minLineGap * ~~(count + 1)
    let canFit = maxContentWidth >= width
    let canFitGreedy = minGreedyContentWidth <= width

    if (canFit && canFitGreedy) {
      count = Math.round(count)
      slotWidth = width / count
    } else if (canFit) {
      count = ~~count
      slotWidth = width / count
    } else if (canFitGreedy) {
      count = ~~(count + 1)
      slotWidth = width / count
    } else {
      count = ~~count
      slotWidth = options.maxLineGap
    }
    if (count === 1) {
      slotWidth = Math.min(width, options.singleMaxWidth)
      slotWidth = Math.max(slotWidth, options.minLineGap)
    }
  }
  return {
    width: getArrayFillWith(slotWidth, count),
    count: count,
    left: 0,
  }
}




/**
 * util
 */
function getArrayFillWith(item: any, count: number) {
  let getter = typeof item === 'function' ? () => item() : () => item
  let arr = []
  for (let i = 0; i < count; i++) {
    arr[i] = getter()
  }
  return arr
}

