interface WaterfallCell {
  index: number
  width: number
  height: number
  style: any
  // order: number
  // moveClass: string
}
interface Rectangle {
  width: number
  height: number
  left: number
  top: number
}
// interface Rectangles {
//   [index: number]: Rectangle
// }
interface WaterfallConfig {
  interval: number
  lineGap: number
  minLineGap: number
  maxLineGap: number
  singleMaxWidth: number
}
