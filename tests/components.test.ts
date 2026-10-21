import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { WaterfallCell, WaterfallContainer } from '../lib'

class ResizeMock {
  static instances: ResizeMock[] = []
  observed = new Set<Element>()
  observe = vi.fn((element: Element) => this.observed.add(element))
  unobserve = vi.fn((element: Element) => this.observed.delete(element))
  disconnect = vi.fn(() => this.observed.clear())
  constructor(private callback: ResizeObserverCallback) { ResizeMock.instances.push(this) }
  trigger(target: Element, width = 600) {
    this.callback([{ target, contentRect: { width } } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }
}

class IntersectionMock {
  static instances: IntersectionMock[] = []
  observe = vi.fn()
  disconnect = vi.fn()
  constructor(private callback: IntersectionObserverCallback, public options: IntersectionObserverInit) {
    IntersectionMock.instances.push(this)
  }
  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

let frames: Map<number, FrameRequestCallback>
let frameId: number
let wrappers: VueWrapper[]
let heights: Map<string, number>
let sentinelTop: number
function cell(id: string, height: number) {
  return h(WaterfallCell, { key: id, 'data-id': id }, () => h('div', { 'data-height': height }, id))
}
function keep<T extends VueWrapper>(wrapper: T): T {
  document.body.append(wrapper.element)
  wrappers.push(wrapper)
  return wrapper
}
async function settle() {
  await nextTick()
  await flushPromises()
  for (let attempt = 0; attempt < 12 && frames.size; attempt++) {
    const queued = Array.from(frames.values())
    frames.clear()
    queued.forEach(callback => callback(0))
    await nextTick()
    await flushPromises()
  }
  expect(frames.size, 'layout must settle without an animation-frame loop').toBe(0)
}
function cells(wrapper: VueWrapper) { return wrapper.findAll('.biu-waterfall-cell') }
function lastLayout(wrapper: VueWrapper) {
  const events = wrapper.emitted('layout')!
  return events[events.length - 1]![0] as { height: number; columns: number; columnWidth: number }
}

beforeEach(() => {
  frames = new Map()
  frameId = 0
  heights = new Map()
  sentinelTop = 200
  wrappers = []
  ResizeMock.instances = []
  IntersectionMock.instances = []
  vi.stubGlobal('ResizeObserver', ResizeMock)
  vi.stubGlobal('IntersectionObserver', IntersectionMock)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return Number(this.closest('[data-width]')?.getAttribute('data-width') ?? 600)
  })
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return heights.get(this.dataset.id ?? '') ?? Number(this.firstElementChild?.getAttribute('data-height') ?? 0)
  })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const top = this.classList.contains('biu-waterfall__sentinel') ? sentinelTop : 0
    return { x: 0, y: top, left: 0, top, right: 600, bottom: top + 1, width: 600, height: 1, toJSON() {} }
  })
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(function (this: HTMLElement) {
    if (this.closest('[hidden]')) return [] as unknown as DOMRectList
    return [this.getBoundingClientRect()] as unknown as DOMRectList
  })
})

afterEach(() => {
  wrappers.forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('WaterfallContainer and WaterfallCell', () => {
  it('measures the container, packs natural content and gives the track its full height', async () => {
    const wrapper = keep(mount(WaterfallContainer, {
      props: { columns: 2, gap: 20 },
      slots: { default: () => [cell('a', 120), cell('b', 80), cell('c', 40)] },
    }))
    await settle()
    expect(cells(wrapper).map(item => (item.element as HTMLElement).style.transform))
      .toEqual(['translate(0px, 0px)', 'translate(310px, 0px)', 'translate(310px, 100px)'])
    expect(cells(wrapper)[0]!.attributes('style')).toContain('width: 290px')
    expect(wrapper.find('.biu-waterfall__track').attributes('style')).toContain('height: 140px')
    expect(wrapper.emitted('layout')).toHaveLength(1)
    expect(ResizeMock.instances[0]!.observe).toHaveBeenCalledWith(cells(wrapper)[0]!.element, { box: 'border-box' })
  })

  it('keeps sibling instances isolated when one is changed or unmounted', async () => {
    const first = keep(mount(WaterfallContainer, { attrs: { 'data-width': 320 }, slots: { default: () => cell('a', 90) } }))
    const second = keep(mount(WaterfallContainer, { attrs: { 'data-width': 900 }, slots: { default: () => [cell('b', 30), cell('c', 70)] } }))
    await settle()
    expect(lastLayout(first).columns).toBe(1)
    expect(lastLayout(second).columns).toBe(3)
    first.unmount()
    wrappers = [second]
    await second.setProps({ columns: 1 })
    await settle()
    expect(lastLayout(second).height).toBe(116)
    expect(cells(second)).toHaveLength(2)
  })

  it('handles keyed reordering, deletion, insertion and empty lists at unchanged width', async () => {
    const items = ref([{ id: 'a', height: 100 }, { id: 'b', height: 50 }, { id: 'c', height: 70 }])
    const wrapper = keep(mount(defineComponent({ setup: () => () => h(WaterfallContainer, { columns: 1, gap: 10 }, () => items.value.map(item => cell(item.id, item.height))) })))
    await settle()
    items.value.reverse()
    await settle()
    expect(cells(wrapper).map(item => item.attributes('data-id'))).toEqual(['c', 'b', 'a'])
    expect((cells(wrapper)[2]!.element as HTMLElement).style.transform).toBe('translate(0px, 140px)')
    items.value.splice(1, 1, { id: 'd', height: 20 })
    await settle()
    expect((cells(wrapper)[2]!.element as HTMLElement).style.transform).toBe('translate(0px, 110px)')
    items.value = []
    await settle()
    expect(wrapper.find('.biu-waterfall__track').attributes('style')).toContain('height: 0px')
  })

  it('responds to parent resizing without a window resize', async () => {
    const wrapper = keep(mount(WaterfallContainer, { slots: { default: () => [cell('a', 40), cell('b', 60)] } }))
    await settle()
    ResizeMock.instances[0]!.trigger(wrapper.find('.biu-waterfall__track').element, 180)
    await settle()
    expect(lastLayout(wrapper)).toMatchObject({ columns: 1, columnWidth: 180, height: 116 })
  })

  it('batches asynchronous content changes and ignores identical observer notifications', async () => {
    const wrapper = keep(mount(WaterfallContainer, { props: { columns: 1, gap: 10 }, slots: { default: () => [cell('a', 40), cell('b', 60)] } }))
    await settle()
    heights.set('a', 135)
    const observer = ResizeMock.instances[0]!
    for (let i = 0; i < 10; i++) observer.trigger(cells(wrapper)[0]!.element)
    expect(frames.size).toBe(1)
    await settle()
    expect(lastLayout(wrapper).height).toBe(205)
    observer.trigger(cells(wrapper)[0]!.element)
    expect(frames.size).toBe(0)
    expect(wrapper.emitted('layout')).toHaveLength(2)
  })

  it('reserves aspect-ratio height and handles dimension changes without mutating inputs', async () => {
    const dimensions = ref<Readonly<{ width: number; height: number }>>(Object.freeze({ width: 200, height: 100 }))
    const wrapper = keep(mount(defineComponent({ setup: () => () => h(WaterfallContainer, { columns: 1 }, () => h(WaterfallCell, dimensions.value, () => 'image')) })))
    await settle()
    expect(cells(wrapper)[0]!.attributes('style')).toContain('height: 300px')
    dimensions.value = Object.freeze({ width: 200, height: 200 })
    await settle()
    expect(cells(wrapper)[0]!.attributes('style')).toContain('height: 600px')
    expect(wrapper.find('.biu-waterfall__track').attributes('style')).toContain('height: 600px')
    expect(dimensions.value).toEqual({ width: 200, height: 200 })
  })

  it('measures untransformed CSS pixels, including fractional border-box dimensions', async () => {
    const wrapper = keep(mount(WaterfallContainer, { props: { columns: 1, gap: 0 }, slots: { default: () => [h(WaterfallCell, { style: { height: '100.5px', boxSizing: 'border-box' } }), cell('b', 40)] } }))
    await settle()
    // DOMRect is intentionally 1px high in this fixture, like an ancestor scale.
    expect(lastLayout(wrapper).height).toBe(140.5)
    expect((cells(wrapper)[1]!.element as HTMLElement).style.transform).toBe('translate(0px, 100.5px)')
  })

  it('excludes hidden cards without leaving gaps and restores them when shown', async () => {
    const wrapper = keep(mount(WaterfallContainer, { props: { columns: 1, gap: 10 }, slots: { default: () => [cell('a', 100), cell('b', 50), cell('c', 100)] } }))
    await settle()
    const middle = cells(wrapper)[1]!.element as HTMLElement
    middle.hidden = true
    ResizeMock.instances[0]!.trigger(middle)
    await settle()
    expect(lastLayout(wrapper).height).toBe(210)
    expect((cells(wrapper)[2]!.element as HTMLElement).style.transform).toBe('translate(0px, 110px)')
    middle.hidden = false
    ResizeMock.instances[0]!.trigger(middle)
    await settle()
    expect(lastLayout(wrapper).height).toBe(270)
  })

  it('recovers when an initially hidden container becomes visible', async () => {
    const wrapper = keep(mount(WaterfallContainer, { attrs: { hidden: true }, slots: { default: () => cell('a', 100) } }))
    await settle()
    expect(lastLayout(wrapper).height).toBe(0)
    ;(wrapper.element as HTMLElement).hidden = false
    ResizeMock.instances[0]!.trigger(wrapper.find('.biu-waterfall__track').element, 320)
    await settle()
    expect(lastLayout(wrapper)).toMatchObject({ height: 100, columnWidth: 320, columns: 1 })
  })

  it('includes padding and borders in content-box heights', async () => {
    const wrapper = keep(mount(WaterfallContainer, { slots: { default: () => h(WaterfallCell, { style: { height: '80px', padding: '10px', border: '2px solid', boxSizing: 'content-box' } }) } }))
    await settle()
    expect(lastLayout(wrapper).height).toBe(104)
  })

  it('cleans up observers and queued frames on unmount', async () => {
    const wrapper = keep(mount(WaterfallContainer, { slots: { default: () => cell('a', 40) } }))
    expect(frames.size).toBe(1)
    wrapper.unmount()
    wrappers = []
    await settle()
    expect(ResizeMock.instances[0]!.disconnect).toHaveBeenCalledOnce()
    expect(IntersectionMock.instances[0]!.disconnect).toHaveBeenCalledOnce()
    expect(wrapper.emitted('layout')).toBeUndefined()
  })

  it('gates reach-end by loading, hasMore and visibility, and rearms after a completed page', async () => {
    const scrollRoot = document.createElement('div')
    const wrapper = keep(mount(WaterfallContainer, { props: { loading: true, scrollRoot, threshold: 250 } }))
    await settle()
    const observer = IntersectionMock.instances[0]!
    expect(observer.options).toEqual({ root: scrollRoot, rootMargin: '250px 0px' })
    observer.trigger(true)
    expect(wrapper.emitted('reach-end')).toBeUndefined()
    await wrapper.setProps({ loading: false })
    await settle()
    expect(wrapper.emitted('reach-end')).toHaveLength(1)
    observer.trigger(true)
    await settle()
    expect(wrapper.emitted('reach-end')).toHaveLength(1)
    await wrapper.setProps({ loading: true })
    await wrapper.setProps({ loading: false })
    await settle()
    expect(wrapper.emitted('reach-end')).toHaveLength(2)
    await wrapper.setProps({ hasMore: false })
    observer.trigger(false)
    observer.trigger(true)
    expect(wrapper.emitted('reach-end')).toHaveLength(2)
    await wrapper.setProps({ hasMore: true })
    await settle()
    expect(wrapper.emitted('reach-end')).toHaveLength(3)
  })

  it('does not load from a stale intersection after appended content pushes the end away', async () => {
    const wrapper = keep(mount(WaterfallContainer))
    await settle()
    IntersectionMock.instances[0]!.trigger(true)
    expect(wrapper.emitted('reach-end')).toHaveLength(1)
    await wrapper.setProps({ loading: true })
    sentinelTop = 3000
    await wrapper.setProps({ loading: false })
    await settle()
    expect(wrapper.emitted('reach-end')).toHaveLength(1)
    sentinelTop = 200
    IntersectionMock.instances[0]!.trigger(true)
    expect(wrapper.emitted('reach-end')).toHaveLength(2)
  })

  it('supports explicit reflow and load/resize fallback when observers are unavailable', async () => {
    vi.stubGlobal('ResizeObserver', undefined)
    vi.stubGlobal('IntersectionObserver', undefined)
    const wrapper = keep(mount(WaterfallContainer, { props: { columns: 1 }, slots: { default: () => cell('a', 40) } }))
    await settle()
    heights.set('a', 120)
    await cells(wrapper)[0]!.trigger('load')
    await settle()
    expect(lastLayout(wrapper).height).toBe(120)
    heights.set('a', 150)
    ;(wrapper.vm as unknown as { reflow: () => void }).reflow()
    await settle()
    expect(lastLayout(wrapper).height).toBe(150)
    expect(wrapper.emitted('reach-end')).toHaveLength(1)
  })
})
