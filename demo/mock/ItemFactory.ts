export interface DemoItem {
  id: number
  title: string
  color: string
  accent: string
  shape: 'orbit' | 'arch' | 'steps' | 'sun'
  artworkHeight: number
}

const themes = [
  { title: '轨道', color: '#ecf3df', accent: '#536b37', shape: 'orbit' },
  { title: '拱门', color: '#f7eadc', accent: '#ad6c39', shape: 'arch' },
  { title: '台阶', color: '#e6eaf6', accent: '#6474ad', shape: 'steps' },
  { title: '日落', color: '#f6e4df', accent: '#b76e5e', shape: 'sun' },
  { title: '青影', color: '#e1efec', accent: '#488278', shape: 'arch' },
  { title: '环绕', color: '#eee6f0', accent: '#946ca0', shape: 'orbit' },
] as const

export function createItemFactory() {
  let nextId = 1
  return {
    get(count: number): DemoItem[] {
      return Array.from({ length: count }, () => {
        const id = nextId++
        return {
          id,
          ...themes[(id - 1) % themes.length],
          artworkHeight: 120 + ((id * 37) % 110),
        }
      })
    },
  }
}

export default createItemFactory()
