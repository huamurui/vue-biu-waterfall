let ItemFactory = (function () {

  let lastIndex = 0

  function generateRandomItems(count: number) {
    let items = [], i
    for (i = 0; i < count; i++) {
      items[i] = {
        index: lastIndex++,
        style: {
          background: getRandomColor()
        },
        width: 150 + ~~(Math.random() * 50),
        height: 220 + ~~(Math.random() * 50)
      }
    }
    return items
  }

  function getRandomColor() {
    let colors = [
      'rgba(21,174,103,.5)',
      'rgba(245,163,59,.5)',
      'rgba(255,230,135,.5)',
      'rgba(194,217,78,.5)',
      'rgba(195,123,177,.5)',
      'rgba(125,205,244,.5)',
      'pink',
      'skyblue'
    ]
    return colors[~~(Math.random() * colors.length)]
  }

  return {
    get: generateRandomItems
  }

})()
export default ItemFactory