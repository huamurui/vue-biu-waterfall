interface WaterfallCell {
  index: number
  width: number
  height: number
  style: any
}
interface Rectangle {
  width: number
  height: number
  left: number
  top: number
}

interface WaterfallConfig {
  interval: number
  lineGap: number
  minLineGap: number
  maxLineGap: number
  singleMaxWidth: number
}
