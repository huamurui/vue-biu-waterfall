import { reactive } from 'vue';


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

//scale the rect to fit the layout
//and maybe we need to set the rect's left and top here too. ...but ... a little bit complicated
const setRect = (width: number) => {
  mediatorRects.forEach((rect) => {
    rect.height = rect.height * (width / rect.width)
    rect.width = width
    // console.log(rect)
  })
}
export { getRect, setRect, mediatorRects }



// DOMRect {top: 0, left: 0, width: 0, height: 0}