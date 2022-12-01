// the functions here will change and do operations on the original variable
export { setRects, adjustCells, manageCells }
import { mediatorRects } from '../stores/useWaterStore'


//scale the rect to fit the layout
const setRects = (width: number) => {
  mediatorRects.forEach((rect) => {
    rect.height = rect.height * (width / rect.width)
    rect.width = width
  })
}

//set the rect's left and top here too.
const adjustCells = (cells: Rectangle[], columnHeights: Array<number>, columnWidth: number, reflow: boolean) => {
  let columnIndex = getMinKey(columnHeights)
  let columnHeight = columnHeights[columnIndex]
  for (let j = 0; j < cells.length; j++) {
    // Place the cell to column with the minimal height.
    columnIndex = getMinKey(columnHeights)
    columnHeight = columnHeights[columnIndex]
    cells[j].left = columnIndex * columnWidth
    cells[j].top = columnHeight
    columnHeights[columnIndex] = columnHeight + cells[j].height
  }
}

// I keep this empty function here for reminding me what vue has done to save my work time.
// I move the state management to every cell component's interior, so I don't need to write this function and the 'for loop' in it to change the state anymore.
const manageCells = {}

/*
utils
*/
const getMinVal = (columnHeights: Array<number>) => Math.min.apply(Math, columnHeights)
const getMinKey = (columnHeights: Array<number>) => columnHeights.indexOf(getMinVal(columnHeights))
