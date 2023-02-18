import data from './data.json'

//https://juejin.cn/post/6844903728244342792

// import probe from 'probe-image-size';
// https://github.com/nodeca/probe-image-size
// https://github.com/nodeca/probe-image-size/issues/64
// 草了...又是这个b，之前那个 markdown-it 也是，这家伙是真的...这么讨厌 es6 吗。
// https://github.com/nodeca/probe-image-size/issues/72
// https://github.com/nodeca/probe-image-size/issues/70
// .... 好霸道，直接关 issue。qnmd.


let ImageCenter = (function () {
  let lastIndex = 0
  async function getManyImages(count: number) {
    let indexBi = lastIndex
    lastIndex = lastIndex + count
    let metaImages: any[] = []

    for(let i=0;i<count;i++){
      metaImages.push({
        index:indexBi,
        url:`https://huamurui.github.io/data_and_so_on/images/paintings/shameful/${data[indexBi].name}`,
        width:999,
        height:999,
        style:{}
      })
      indexBi++
    }

    // 除了上面那个库讨论的问题，还看了一些异步任务同时进行的东西...，还有数组合并之类的...
    // 最后还是决定不干这些玩意了，把数据直接加上宽高好了，这事只在前端做真的太麻烦了...还不如自己直接搞搞数据。所以，这个文件是废弃了，就是记录一下。 关于高度问题，一般卡片也会有一个底部的信息描述，这段信息的高度也可能不同，主要是，根据分类来做。
    // 当然，还有因为网络太慢布局弄好了但是图片还是慢悠悠的出来一片空白的问题，也许还要再组件内搞一些判断，异步同步那堆还是要写。但...管他呢。

    // 再有一个，打包...你现在完全没有打包，是直接引用源码，这...像小朋友玩过家家。看看 rollup pnpm monorepo 之类的东西吧。或者先放弃这里，写成个应用好了。
    // 反正，后端还是得学，前端的工程化也是，但是...感觉还是先切图切好了再说吧。

    // 计划....需要一个计划。
    
    async function f(){
      for (let metaImage of metaImages){
        getSize(metaImage)
      }
      return Promise.all(metaImages)
    }
    return f()
  }

  async function getSize(metaImage: any) {
      let img = new Image()
      img.src = metaImage.url
      img.onload = () => {
        metaImage.width = img.width,
        metaImage.height = img.height
      }
  }
  return {
    get: getManyImages
  }
})()

export default ImageCenter
