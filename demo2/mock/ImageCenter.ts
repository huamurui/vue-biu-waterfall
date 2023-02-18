import data from './data.json'

let ImageCenter = (function () {
  let lastIndex = 0
  //I'm thinking about a question, is the reason why 'await' can only be written in async function is that if the mother function is not async and does not return Promise, then the async of the sub-function is useless.
  async function getManyImages(count: number) {
    let items: any = []
    let indexBi = lastIndex
    lastIndex = lastIndex + count
    for (let i = 0; i < count; i++) {
      items.push({
        index: indexBi,
        url: `https://huamurui.github.io/data_and_so_on/images/paintings/shameful/${data[indexBi].name}`,
        width: `${data[indexBi].width}`,
        height: `${data[indexBi].height}`,
        style: {
          background:"skyblue",
          borderRadius:"10px",
          boxShadow:"0 0 10px #bbb",
        }
      })
      indexBi++
    }
    return items
  }

  return {
    get: getManyImages
  }
})()
export default ImageCenter
