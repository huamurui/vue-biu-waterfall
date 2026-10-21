export interface DemoImage {
  id: number
  width: number
  height: number
  url: string
  description: string
}

const colors = [
  ['#dde8c9', '#779259'],
  ['#f2d6c0', '#ca9674'],
  ['#d5dff0', '#7b92ba'],
  ['#eed5dd', '#bd8497'],
] as const

/** Local, deterministic SVG images keep the example usable offline. */
export function createImageFactory() {
  let nextId = 1
  return {
    get(count: number): DemoImage[] {
      return Array.from({ length: count }, () => {
        const id = nextId++
        const width = 400
        const height = 320 + ((id * 73) % 220)
        const [background, foreground] = colors[(id - 1) % colors.length]
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${background}"/><circle cx="280" cy="110" r="62" fill="${foreground}" opacity=".65"/><path d="M0 ${height}V${height * 0.65}Q100 ${height * 0.3} 200 ${height * 0.65}T400 ${height * 0.6}V${height}Z" fill="${foreground}"/><path d="M0 ${height}V${height * 0.83}Q100 ${height * 0.55} 220 ${height * 0.8}T400 ${height * 0.75}V${height}Z" fill="${background}" opacity=".5"/></svg>`
        return {
          id,
          width,
          height,
          url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
          description: `本地生成的抽象风景 ${id}`,
        }
      })
    },
  }
}

export default createImageFactory()
