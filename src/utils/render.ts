export { }
// // the functions here will change and do operations on the original variable
// export { adjustCells, manageCells }
// const adjustCells = (cells: WaterfallCell[], columnHeights: Array<number>, reflow: boolean) => {
//   let columnIndex = getMinKey(columnHeights)
//   let columnHeight
//   for (let j = 0; j < cells.length; j++) {
//     // Place the cell to column with the minimal height.
//     columnIndex = getMinKey(columnHeights)
//     columnHeight = columnHeights[columnIndex]
//     cells[j].style.height = (cells[j].offsetHeight - CELL_PADDING) + 'px'
//     cells[j].style.left = columnIndex * (COLUMN_WIDTH + GAP_WIDTH) + 'px'
//     cells[j].style.top = columnHeight + 'px'
//     columnHeights[columnIndex] = columnHeight + GAP_HEIGHT + cells[j].offsetHeight
//     if (!reflow) {
//       cells[j].className = 'cell ready'
//     }
//   }
//   //  cellsContainer.style.height = getMaxVal(columnHeights) + 'px'
// }



// //number[] Array<number>有区别吗
// const manageCells = (managing: boolean, columnHeights: number[], columnCount: number) => {
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
//   if (viewportBottom > getMinVal(columnHeights)) {
//     // Remove the if/else statement in your project, just call the appendCells function.
//     appendCells(columnCount)
//   }


//   // Unlock managing state.
//   managing = false
// }

// const getMinKey = (columnHeights: Array<number>) => {
//   let min = columnHeights[0]
//   let minKey = 0
//   for (let i = 1; i < columnHeights.length; i++) {
//     if (columnHeights[i] < min) {
//       min = columnHeights[i]
//       minKey = i
//     }
//   }
//   return minKey
// }

// const getMinVal = (columnHeights: number[]) => {
//   let min = columnHeights[0]
//   for (let i = 1; i < columnHeights.length; i++) {
//     if (columnHeights[i] < min) {
//       min = columnHeights[i]
//     }
//   }
//   return min
// }