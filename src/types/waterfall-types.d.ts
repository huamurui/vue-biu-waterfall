interface WaterfallCell {
  index: number
  width: number
  height: number
  style: any
  // order: number
  // moveClass: string
}
//需要之后在这里添style吗？还是完全抽离？...是实例化的时候能加，别的不行...给我整的麻麻的

// interface WaterfallCells [
//   WaterfallCell
// ]
//这种方法，有时候可以使用索引...有时候不行，而数组的forEach，push等方法也不能调用
//等等..大括号是创建的对象是吗艹。或者说这全是对象...日了。那那种写法是干什么的？
//之前直接WaterfallCell[]也可以解决问题...
//所以到底有没有"ts 以一个类型为基础，创建这个类型的数组并指定index"这种合法操作...
interface Rectangle {
  width: number
  height: number
  left: number
  top: number
}
interface Rectangles {
  [index: number]: Rectangle
}
interface WaterfallConfig {
  interval: number // 防抖时间间隔，默认200ms
  lineGap: number         //列间隔
  minLineGap: number // 最小列间隔
  maxLineGap: number //最大列间隔
  singleMaxWidth: number // 单个元素的最大宽度
  // columnWidth: number // 适应后的列宽

}
