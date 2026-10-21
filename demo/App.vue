<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { WaterfallContainer, WaterfallCell } from '../lib'
import type { WaterfallLayout } from '../lib'
import GalleryDemo from '../demo2/App.vue'
import { createItemFactory } from './mock/ItemFactory'

let factory = createItemFactory()
const items = ref(factory.get(12))
const columnWidth = ref(240)
const gap = ref(18)
const expanded = ref(new Set<number>())
const layout = ref<WaterfallLayout>()
const autoLoad = ref(false)
const loading = ref(false)
const scrollRoot = ref<HTMLElement | null>(null)
let loadTimer: ReturnType<typeof setTimeout> | undefined
const hasMore = computed(() => autoLoad.value && items.value.length < 48)

function toggleExpanded(id: number) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function addItems() {
  items.value.push(...factory.get(3))
}

function removeItem(id: number) {
  items.value = items.value.filter(item => item.id !== id)
  expanded.value.delete(id)
}

function reset() {
  if (loadTimer !== undefined) clearTimeout(loadTimer)
  loading.value = false
  autoLoad.value = false
  factory = createItemFactory()
  items.value = factory.get(12)
  expanded.value = new Set()
  columnWidth.value = 240
  gap.value = 18
  scrollRoot.value?.scrollTo({ top: 0 })
}

function loadMore(result: WaterfallLayout) {
  if (!hasMore.value || loading.value) return
  loading.value = true
  loadTimer = setTimeout(() => {
    items.value.push(...factory.get(Math.min(Math.max(result.columns, 3), 48 - items.value.length)))
    loading.value = false
  }, 450)
}

onBeforeUnmount(() => {
  if (loadTimer !== undefined) clearTimeout(loadTimer)
})
</script>

<template>
  <div class="demo-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Biu Waterfall 首页">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>biu<span class="brand-light"> / waterfall</span></span>
      </a>
      <div class="header-meta">
        <span class="version">v2.0.0</span>
        <a class="source-link" href="https://github.com/huamurui/vue-biu-waterfall" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <main aria-label="瀑布流示例">
      <section class="controls" aria-label="布局设置">
        <label class="range-control">
          <span>列宽 <output>{{ columnWidth }}<small>px</small></output></span>
          <input v-model.number="columnWidth" type="range" min="160" max="360" step="10" />
        </label>
        <label class="range-control">
          <span>间距 <output>{{ gap }}<small>px</small></output></span>
          <input v-model.number="gap" type="range" min="0" max="36" step="2" />
        </label>
        <div class="control-divider" aria-hidden="true"></div>
        <div class="actions">
          <button class="button button-primary" type="button" @click="addItems"><span aria-hidden="true">＋</span> 添加</button>
          <button class="button" type="button" @click="items.reverse()"><span aria-hidden="true">↔</span> 倒序</button>
          <button class="button button-quiet" type="button" @click="reset">重置</button>
        </div>
      </section>

      <div class="workspace">
        <section class="main-panel" aria-label="瀑布流交互示例">
          <div class="panel-heading">
            <span class="item-count">{{ items.length }} 张</span>
            <span class="layout-status" aria-live="polite">{{ layout?.columns ?? '—' }} 列</span>
          </div>
          <div ref="scrollRoot" class="scroll-area" tabindex="0" aria-label="可滚动的卡片列表">
            <WaterfallContainer
              :column-width="columnWidth"
              :gap="gap"
              :loading="loading"
              :has-more="hasMore"
              :scroll-root="scrollRoot"
              :threshold="120"
              @layout="layout = $event"
              @reach-end="loadMore"
            >
              <WaterfallCell v-for="item in items" :key="item.id">
                <article class="card">
                  <div class="artwork" :class="`artwork-${item.shape}`" :style="{ height: `${item.artworkHeight}px`, background: item.color, color: item.accent }" aria-hidden="true">
                    <span class="artwork-shape"></span><span class="artwork-detail"></span>
                    <span class="artwork-number">{{ String(item.id).padStart(2, '0') }}</span>
                  </div>
                  <div class="card-content">
                    <h2>{{ item.title }}</h2>
                    <div v-if="expanded.has(item.id)" class="extra-content" aria-label="展开内容"><span></span><span></span><span></span></div>
                    <div class="card-footer">
                      <button type="button" :aria-expanded="expanded.has(item.id)" @click="toggleExpanded(item.id)">{{ expanded.has(item.id) ? '收起' : '展开' }} <span aria-hidden="true">{{ expanded.has(item.id) ? '−' : '＋' }}</span></button>
                      <button type="button" class="remove-button" :aria-label="`删除第 ${item.id} 张卡片`" @click="removeItem(item.id)"><span aria-hidden="true">×</span></button>
                    </div>
                  </div>
                </article>
              </WaterfallCell>
            </WaterfallContainer>
            <p v-if="items.length === 0" class="empty-state">暂无卡片</p>
            <p v-if="loading" class="loading-state" role="status">加载中…</p>
            <p v-else-if="autoLoad && !hasMore" class="loading-state">已全部加载</p>
          </div>
          <div class="panel-footer">
            <label class="auto-load"><input v-model="autoLoad" type="checkbox" /> 自动加载</label>
          </div>
        </section>

        <aside class="sidebar">
          <GalleryDemo />
        </aside>
      </div>
    </main>
  </div>
</template>

<style>
:root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #30382d; background: #f8f9f4; font-synthesis: none; -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; }
body { margin: 0; }
button, input { font: inherit; }
button, a, input { -webkit-tap-highlight-color: transparent; }
button:focus-visible, a:focus-visible, input:focus-visible, [tabindex]:focus-visible { outline: 2px solid #688148; outline-offset: 4px; }
a { color: inherit; text-decoration: none; }
.demo-shell { max-width: 1480px; padding: 0 48px; margin: 0 auto; }
.topbar { height: 76px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e4e7dc; }
main { padding: 24px 0; }
.header-meta { display: flex; align-items: center; gap: 20px; }
.brand { display: flex; align-items: center; gap: 13px; font-size: 21px; font-weight: 650; letter-spacing: -.6px; }
.brand-light { color: #7b8273; font-weight: 400; }
.brand-mark { width: 28px; height: 28px; display: flex; gap: 4px; align-items: flex-start; }
.brand-mark i { width: 6px; background: #718b4a; border-radius: 2px; height: 22px; }
.brand-mark i:nth-child(2) { height: 14px; margin-top: 3px; }
.brand-mark i:nth-child(3) { height: 24px; margin-top: 4px; }
.version { display: flex; gap: 10px; color: #7c8473; font-size: 11px; letter-spacing: .05em; }
.source-link { white-space: nowrap; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #667455; }
.controls { display: flex; align-items: center; gap: 30px; padding: 21px 24px; border: 1px solid #e3e6db; border-radius: 13px; background: #fff; }
.range-control { display: flex; flex-direction: column; gap: 10px; flex: 1; max-width: 260px; font-size: 12px; }
.range-control > span { display: flex; justify-content: space-between; gap: 16px; color: #737c68; }
.range-control output { color: #3c4931; font-variant-numeric: tabular-nums; }
.range-control small { margin-left: 4px; color: #92988b; font-size: 10px; }
.range-control input { width: 100%; margin: 0; height: 14px; accent-color: #748b51; cursor: pointer; }
.control-divider { height: 32px; width: 1px; background: #e6e8df; }
.actions { display: flex; gap: 9px; margin-left: auto; }
.button { display: inline-flex; gap: 7px; align-items: center; justify-content: center; white-space: nowrap; border: 1px solid #e3e6dc; border-radius: 7px; background: #fff; padding: 10px 14px; font-size: 12px; color: #626c56; cursor: pointer; }
.button:hover { background: #f4f6ee; }
.button-primary { color: #fff; border-color: #70894b; background: #70894b; }
.button-primary:hover { background: #60783e; }
.button-quiet { border-color: transparent; background: transparent; color: #8b9281; padding-left: 8px; padding-right: 8px; }
.workspace { display: grid; grid-template-columns: minmax(0, 1fr) 292px; gap: 30px; margin-top: 24px; }
.main-panel { min-width: 0; }
.panel-heading { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 19px; min-height: 18px; }
.item-count { color: #8b9281; font-size: 11px; }
.layout-status { color: #909787; font-size: 10px; }
.scroll-area { height: 760px; overflow: auto; scrollbar-width: thin; scrollbar-color: #ced5c3 transparent; padding: 1px 8px 1px 1px; }
.card { border: 1px solid #e5e7df; border-radius: 12px; background: #fff; overflow: hidden; }
.artwork { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.artwork-shape, .artwork-detail { display: block; position: absolute; }
.artwork-number { position: absolute; right: 12px; bottom: 10px; font-size: 10px; opacity: .5; letter-spacing: .1em; }
.artwork-orbit .artwork-shape { width: 100px; height: 100px; border: 1px solid currentColor; border-radius: 50%; transform: rotate(-30deg); }
.artwork-orbit .artwork-detail { width: 145px; height: 68px; border: 1px solid currentColor; border-radius: 50%; transform: rotate(-30deg); }
.artwork-arch .artwork-shape { width: 90px; height: 118px; border-radius: 60px 60px 0 0; background: currentColor; opacity: .7; transform: translate(-14px, 4px); }
.artwork-arch .artwork-detail { width: 84px; height: 112px; border-radius: 60px 60px 0 0; border: 1px solid currentColor; transform: translate(18px, -7px); }
.artwork-steps .artwork-shape { width: 85px; height: 90px; background: currentColor; opacity: .6; clip-path: polygon(0 100%, 0 66%, 33% 66%, 33% 33%, 66% 33%, 66% 0, 100% 0, 100% 100%); transform: translate(-12px, 8px); }
.artwork-steps .artwork-detail { width: 85px; height: 90px; background: currentColor; opacity: .3; clip-path: polygon(0 100%, 0 66%, 33% 66%, 33% 33%, 66% 33%, 66% 0, 100% 0, 100% 100%); transform: translate(17px, -12px); }
.artwork-sun .artwork-shape { width: 100px; height: 100px; background: currentColor; opacity: .6; border-radius: 50%; }
.artwork-sun .artwork-detail { width: 150px; height: 1px; background: currentColor; box-shadow: 0 8px currentColor, 0 16px currentColor, 0 24px currentColor, 0 32px currentColor; transform: translateY(12px); opacity: .5; }
.card-content { padding: 17px 17px 9px; }
.card h2 { font-size: 15px; margin: 0 0 9px; line-height: 1.6; font-weight: 600; letter-spacing: -.03em; }
.extra-content { display: grid; gap: 10px; background: #f5f7f0; border-radius: 6px; padding: 18px 12px; }
.extra-content span { height: 7px; width: 85%; border-radius: 4px; background: #dfe6d3; }
.extra-content span:nth-child(2) { width: 65%; }
.extra-content span:nth-child(3) { width: 45%; }
.card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f0f1eb; padding-top: 5px; margin-top: 13px; }
.card-footer button { display: flex; align-items: center; gap: 6px; border: none; background: transparent; color: #929a85; font-size: 10px; padding: 7px 0; cursor: pointer; }
.card-footer button:hover { color: #4f6738; }
.card-footer .remove-button { font-size: 17px; width: 28px; justify-content: center; padding: 2px; }
.panel-footer { padding: 17px 0 0; display: flex; justify-content: flex-end; color: #999f90; font-size: 10px; }
.auto-load { display: flex; align-items: center; gap: 5px; cursor: pointer; white-space: nowrap; }
.auto-load input { accent-color: #748b51; }
.sidebar { padding-top: 37px; }
.loading-state, .empty-state { text-align: center; padding: 24px 12px; color: #8a947c; font-size: 12px; }
@media (min-width: 1500px) { .scroll-area { height: 860px; } }
@media (max-width: 1050px) { .demo-shell { padding: 0 28px; } .workspace { grid-template-columns: minmax(0, 1fr) 250px; gap: 22px; } .controls { gap: 20px; padding: 19px; } .button { padding: 10px; } .control-divider { display: none; } }
@media (max-width: 800px) { .workspace { grid-template-columns: minmax(0, 1fr); } .sidebar { padding-top: 6px; } .controls { flex-wrap: wrap; } .range-control { max-width: none; min-width: 170px; } .actions { margin-left: 0; width: 100%; } .scroll-area { height: 650px; } }
@media (max-width: 520px) { .demo-shell { padding: 0 18px; } .topbar { height: 73px; } .brand { font-size: 18px; } .version { font-size: 9px; } .header-meta { gap: 12px; } .source-link { font-size: 10px; } .controls { gap: 16px; padding: 18px; } .range-control { min-width: 120px; } }
</style>
