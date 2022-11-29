// the functions here will change and do operations on the original variable
export { setRect, adjustCells, manageCells }
import { mediatorRects } from '../components/useWaterStore'


//scale the rect to fit the layout
const setRect = (width: number) => {
  mediatorRects.forEach((rect) => {
    rect.height = rect.height * (width / rect.width)
    rect.width = width
  })
}

//set the rect's left and top here too.
const adjustCells = (cells: Rectangle[], columnHeights: Array<number>, columnWidth: number, reflow: boolean) => {
  let columnIndex = getMinKey(columnHeights)
  let columnHeight = columnHeights[columnIndex]
  columnWidth = columnWidth + 5
  for (let j = 0; j < cells.length; j++) {
    // Place the cell to column with the minimal height.
    columnIndex = getMinKey(columnHeights)
    columnHeight = columnHeights[columnIndex]
    cells[j].left = columnIndex * columnWidth
    cells[j].top = columnHeight
    columnHeights[columnIndex] = columnHeight + cells[j].height + 5
    // if (!reflow) {
    //   cells[j].className = 'cell ready'
    // }
  }
  console.log('columnHeights', columnHeights)
  //  cellsContainer.style.height = getMaxVal(columnHeights) + 'px'
}

// you put the states on Config's emits and using isReflowing as a lock on App.vue...so,...is there a better way to do this? like the example below? and add css animation to the cells.

// //number[] Array<number>有区别吗
const manageCells = {}
// = (managing: boolean, columnHeights: number[], columnCount: number) => {
//   // Lock managing state to avoid another async call. See {Function} delayedScroll.
//   //这里这个变量其实就是...加锁啊...
//   managing = true

//   let cells = cellsContainer.children
//   let viewportTop = (document.body.scrollTop || document.documentElement.scrollTop) - cellsContainer.offsetTop
//   let viewportBottom = (window.innerHeight || document.documentElement.clientHeight) + viewportTop

//   // Remove cells' contents if they are too far away from the viewport. Get them back if they are near.
//   // TODO: remove the cells from DOM should be better :<  :> :) :(
//   for (let i = 0; i < cells.length; i++) {
//     if ((cells[i].offsetTop - viewportBottom > THRESHOLD) || (viewportTop - cells[i].offsetTop - cells[i].offsetHeight > THRESHOLD)) {
//       if (cells[i].className === 'cell ready') {
//         cells[i].fragment = cells[i].innerHTML
//         cells[i].innerHTML = ''
//         cells[i].className = 'cell shadow'
//       }
//     } else {
//       if (cells[i].className === 'cell shadow') {
//         cells[i].innerHTML = cells[i].fragment
//         cells[i].className = 'cell ready'
//       }
//     }
//   }

//   // If there's space in viewport for a cell, request new cells.
//   // if (viewportBottom > getMinVal(columnHeights)) {
//   //   // Remove the if/else statement in your project, just call the appendCells function.
//   //   appendCells(columnCount)
//   // }


//   // Unlock managing state.
//   managing = false
// }

const getMinVal = (columnHeights: Array<number>) => Math.min.apply(Math, columnHeights)

const getMinKey = (columnHeights: Array<number>) => columnHeights.indexOf(getMinVal(columnHeights))
