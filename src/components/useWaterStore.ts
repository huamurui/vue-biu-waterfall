import { reactive } from 'vue';

let mediatorRects: Rectangle[] = reactive([])

const getRect = (cell: WaterfallCell) => {
  let rect = {
    width: cell.width,
    height: cell.height,
    left: cell.style.left,
    top: cell.style.left,
  }
  mediatorRects.push(rect)
}
// mediatorRects[0] = {
//   width: 100,
//   height: 100,
//   left: 0,
//   top: 0,
// }
const setRect = (width: number) => {
  mediatorRects.forEach((rect) => {
    rect.width = width
  })
  console.log(width)
  console.log(mediatorRects)
}
export { getRect, setRect, mediatorRects }


// DOMRect {top: 0, left: 0, width: 0, height: 0}