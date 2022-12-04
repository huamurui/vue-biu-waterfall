let ImageCenter = (function () {
  let lastIndex = 0
  //I'm thinking about a question, is the reason why 'await' can only be written in async function is that if the mother function is not async and does not return Promise, then the async of the sub-function is useless.
  async function getManyImages(count: number) {
    let items: any = []
    let indexBi = lastIndex
    lastIndex = lastIndex + count
    for (let i = 0; i < count; i++) {
      items[i] = await getImage(indexBi)
      indexBi++
    }
    return items
  }

  async function getImage(indexBi: number) {
    let img_url = `https://playthings.huamurui.me/images/Boyana-Petkova${indexBi}.jpg`
    const res: any = await getSize(img_url)
    return new Promise((resolve, reject) => {
      resolve({
        index: indexBi,
        style: {},
        width: res.width,
        height: res.height,
        url: img_url
      })
    })

  }
  function getSize(url: string) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.src = url
      img.onload = () => {
        // console.log('图片加载完成', img.height, img.width)
        resolve({
          height: img.height,
          width: img.width
        })
      }
      img.onerror = () => {
        reject({
          height: 999,
          width: 999
        })
      }
    })
  }


  return {
    get: getManyImages
  }
})()
export default ImageCenter
