<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, shallowRef, watch } from 'vue'
import type { WaterfallContainerInstance, WaterfallContainerProps } from './component-types'
import type { WaterfallLayout } from './types'
import type { CellRegistration } from './context'
import { waterfallKey } from './context'
import { calculateLayout, resolveLayout } from './utils/calculate'

const props = withDefaults(defineProps<WaterfallContainerProps>(), {
  loading: false,
  hasMore: true,
  threshold: 200,
  scrollRoot: null,
})
const emit = defineEmits<{
  layout: [layout: WaterfallLayout]
  'reach-end': [layout: WaterfallLayout]
}>()

const track = ref<HTMLElement>()
const sentinel = ref<HTMLElement>()
const columnWidth = ref<number>()
const layout = shallowRef<WaterfallLayout>()
const cells = new Set<CellRegistration>()
const measuredHeights = new WeakMap<Element, number>()
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let removeScrollListeners: (() => void) | undefined
let frame: number | undefined
let endFrame: number | undefined
let active = false
let running = false
let dirty = false
let observedWidth: number | undefined
let endEmitted = false
let intersecting = false

function reflow() {
  if (!active) return
  dirty = true
  if (running || frame !== undefined) return
  frame = requestAnimationFrame(() => {
    frame = undefined
    void measure()
  })
}

function changed(previous: WaterfallLayout | undefined, next: WaterfallLayout) {
  return !previous || previous.width !== next.width || previous.height !== next.height
    || previous.columns !== next.columns || previous.columnWidth !== next.columnWidth
    || previous.columnGap !== next.columnGap || previous.rowGap !== next.rowGap
    || previous.rects.length !== next.rects.length
    || next.rects.some((rect, index) => {
      const before = previous.rects[index]!
      return rect.left !== before.left || rect.top !== before.top || rect.height !== before.height
    })
}

function cellHeight(element: HTMLElement) {
  // Use CSS layout pixels: DOMRect includes ancestor transforms/zoom and would
  // put scaled cards on top of each other. Computed height preserves fractions.
  if (!element.getClientRects().length) return 0
  const style = window.getComputedStyle(element)
  const height = Number.parseFloat(style.height)
  if (!Number.isFinite(height)) return element.offsetHeight
  if (style.boxSizing === 'border-box') return height
  return height + [style.paddingTop, style.paddingBottom, style.borderTopWidth, style.borderBottomWidth]
    .reduce((sum, value) => sum + (Number.parseFloat(value) || 0), 0)
}

async function measure() {
  if (!active || !track.value) return
  running = true
  dirty = false
  try {
    const width = observedWidth ?? track.value.clientWidth
    const strategy = resolveLayout(width, props)
    columnWidth.value = strategy.columnWidth
    // Apply all widths first, then read all heights, then write all positions.
    await nextTick()
    if (!active) return
    const ordered = Array.from(cells).filter(cell => cell.element.getClientRects().length).sort((a, b) => {
      const position = a.element.compareDocumentPosition(b.element)
      return position & 4 ? -1 : position & 2 ? 1 : 0
    })
    const heights = ordered.map(cell => {
      const height = cellHeight(cell.element)
      measuredHeights.set(cell.element, height)
      return height
    })
    const next = calculateLayout(heights, width, props)
    ordered.forEach((cell, index) => cell.setRect(next.rects[index]!))
    const didChange = changed(layout.value, next)
    if (didChange) layout.value = next
    await nextTick()
    if (!active) return
    if (didChange) emit('layout', next)
    checkEnd()
  } finally {
    running = false
    if (dirty) reflow()
  }
}

provide(waterfallKey, {
  columnWidth,
  reflow,
  register(cell) {
    cells.add(cell)
    resizeObserver?.observe(cell.element, { box: 'border-box' })
    reflow()
    return () => {
      resizeObserver?.unobserve(cell.element)
      cells.delete(cell)
      reflow()
    }
  },
})

function threshold() {
  return Number.isFinite(props.threshold) ? Math.max(0, props.threshold) : 200
}

function checkEnd() {
  if (!active || !layout.value || !sentinel.value) return
  // Verify geometry as an IO callback can still describe the previous layout.
  const end = sentinel.value.getBoundingClientRect()
  const root = props.scrollRoot?.getBoundingClientRect()
  const withinRange = end.top <= (root?.bottom ?? window.innerHeight) + threshold()
    && end.bottom >= (root?.top ?? 0) - threshold()
    && !!track.value?.getClientRects().length
  const visible = withinRange && (!intersectionObserver || intersecting)
  if (!visible) endEmitted = false
  if (visible && !props.loading && props.hasMore && !endEmitted) {
    endEmitted = true
    emit('reach-end', layout.value)
  }
}

function scheduleEndCheck() {
  if (!active || endFrame !== undefined) return
  endFrame = requestAnimationFrame(() => {
    endFrame = undefined
    checkEnd()
  })
}

function observeEnd() {
  intersectionObserver?.disconnect()
  intersectionObserver = undefined
  removeScrollListeners?.()
  removeScrollListeners = undefined
  intersecting = false
  endEmitted = false
  if (!active || !sentinel.value) return
  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1]
      if (!entry) return
      intersecting = entry.isIntersecting
      checkEnd()
    }, { root: props.scrollRoot, rootMargin: `${threshold()}px 0px` })
    intersectionObserver.observe(sentinel.value)
  } else {
    const root = props.scrollRoot ?? window
    root.addEventListener('scroll', scheduleEndCheck, { passive: true })
    window.addEventListener('resize', reflow, { passive: true })
    removeScrollListeners = () => {
      root.removeEventListener('scroll', scheduleEndCheck)
      window.removeEventListener('resize', reflow)
    }
    reflow()
  }
}

watch(() => [props.columnWidth, props.columns, props.minColumns, props.maxColumns,
  ...(Array.isArray(props.gap) ? props.gap : [props.gap])], reflow)
watch(() => [props.scrollRoot, props.threshold], observeEnd, { flush: 'post' })
watch(() => [props.loading, props.hasMore], ([loading, hasMore], [wasLoading, hadMore]) => {
  if ((!loading && wasLoading) || (hasMore && !hadMore)) {
    endEmitted = false
    reflow()
  }
})
onUpdated(reflow)
onMounted(() => {
  active = true
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(entries => {
      let needsLayout = false
      for (const entry of entries) {
        if (entry.target === track.value) {
          if (observedWidth !== entry.contentRect.width) {
            observedWidth = entry.contentRect.width
            needsLayout = true
          }
        } else {
          const height = cellHeight(entry.target as HTMLElement)
          if (measuredHeights.get(entry.target) !== height) {
            measuredHeights.set(entry.target, height)
            needsLayout = true
          }
        }
      }
      if (needsLayout) reflow()
    })
    resizeObserver.observe(track.value!)
    cells.forEach(cell => resizeObserver!.observe(cell.element, { box: 'border-box' }))
  } else {
    window.addEventListener('resize', reflow, { passive: true })
  }
  observeEnd()
  reflow()
})
onBeforeUnmount(() => {
  active = false
  if (frame !== undefined) cancelAnimationFrame(frame)
  if (endFrame !== undefined) cancelAnimationFrame(endFrame)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  removeScrollListeners?.()
  window.removeEventListener('resize', reflow)
  cells.clear()
})

defineExpose<WaterfallContainerInstance>({ reflow })
</script>

<template>
  <div class="biu-waterfall" :aria-busy="loading">
    <div ref="track" class="biu-waterfall__track" :style="{ height: layout ? `${layout.height}px` : undefined }" @load.capture="reflow" @error.capture="reflow">
      <slot />
    </div>
    <div ref="sentinel" class="biu-waterfall__sentinel" aria-hidden="true" />
  </div>
</template>

<style>
:where(.biu-waterfall) { min-width: 0; }
:where(.biu-waterfall__track) { position: relative; display: flow-root; }
:where(.biu-waterfall__sentinel) { height: 1px; pointer-events: none; }
</style>
