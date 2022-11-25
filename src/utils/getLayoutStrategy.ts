// we wil get adapted single cell's width and column count here
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
      //如果算完了还是一列，那么宽度取最大
      slotWidth = Math.min(width, options.singleMaxWidth)
      slotWidth = Math.max(slotWidth, options.minLineGap)
    }
  }
  return {
    width: getArrayFillWith(slotWidth, count),//元素宽度...也许是为了grow的时候方便用的，也是可以删掉...
    count: count,//列数...重命名以下，columnCount
    left: 0,//如果你不用的话...把这个删了吧。
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

