import data from './data.json'

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
    let items: any = []
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
    f()
    async function f(){
      for await(let metaImage of metaImages){
         getSize(metaImage)
      }
      Promise.all(metaImages).then((res)=>{
        console.log(res)
      })
      items.push(...metaImages)
      console.log(items)
    }
    return items
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
