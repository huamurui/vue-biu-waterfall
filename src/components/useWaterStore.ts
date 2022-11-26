import { reactive } from 'vue';

let mediatorRects: DOMRect[] = reactive([])

const getRect = (cell: WaterfallCell) => {
  let rect = {
    width: cell.width,
    height: cell.height,
    left: cell.style.left,
    top: cell.style.left,

    x: 0,
    y: 0,
    bottom: 0,
    right: 0,
    toJSON: () => { }
  }
  mediatorRects.push(rect)
}

const setRect = (width: number) => {
  mediatorRects.forEach((rect) => {
    rect.width = width
  })
  console.log(width)
  console.log(mediatorRects)
}
export { getRect, setRect, mediatorRects }


// DOMRect {top: 0, left: 0, width: 0, height: 0}