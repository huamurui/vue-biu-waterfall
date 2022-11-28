// the functions here won't change the original variable
export { getLayoutStrategy }

// we wil get single cell's adapted width and column count of layout here
const getLayoutStrategy = (width: number, options: WaterfallConfig) => {
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


//scale the rect to fit the layout

// const getAdaptedRect = (metaRect: Rectangle, adaptedWidth: number) => {
//   const { width, height, left, top } = metaRect
//   let scale = (adaptedWidth / width)
//   const rect = {
//     // width: adaptedWidth,
//     height: scale * height,
//     left: left,
//     top: top
//   }
//   console.log(scale)
//   //你个笨蛋哦，这个width上边刚刚被改哦...
//   //嗯...但其实也不是这个原因，你在别的地方，也就是store动了宽度的。
//   return rect
// }




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



