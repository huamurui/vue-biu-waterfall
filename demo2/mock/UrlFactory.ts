let UrlFactory = (function () {
  let lastIndex = 0
  function getManyImages(count: number) {
    let items: any = [], i
    for (i = 0; i < count; i++) {
      let index = lastIndex
      lastIndex++
      items[index] = (getImage(index))
      console.log('count', count)
      console.log('index', index)
    }
    return items
  }
  function getImage(index: number) {
    let img_url = `https://playthings.huamurui.me/images/Boyana-Petkova${index}.jpg`
    let img = new Image()
    img.src = img_url
    console.log('getImage', index, img.width, img.height)
    return {
      index: index,
      style: {},
      width: img.width || 999999,
      height: img.height || 0,
      url: img_url
    }
  }
  return {
    get: getManyImages
  }
})()
export default UrlFactory
