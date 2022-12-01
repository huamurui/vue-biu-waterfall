interface WaterfallCell {
  index: number
  width: number
  height: number
  style?: any | null
  url?: string | null
  content?: any | null
  action?: () => string
  [keyName: string]: any


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
