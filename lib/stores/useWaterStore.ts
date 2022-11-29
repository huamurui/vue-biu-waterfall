import { reactive } from 'vue';
export { getRect, mediatorRects }
//help to get the rect of each cell and store them in mediatorRects
let mediatorRects: Rectangle[] = reactive([])
const getRect = (cell: WaterfallCell) => {
  let rect = {
    width: cell.width,
    height: cell.height,
    left: cell.style.left,
    top: cell.style.top,
  }
  mediatorRects.push(rect)
}
