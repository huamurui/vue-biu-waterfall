# vue-biu-waterfall

一个只负责布局的 Vue 3 瀑布流组件。v2 根据**容器宽度**选择列数，把下一张卡片放进最短的一列；卡片可以使用自然内容高度，也可以提前指定宽高比例。

- 每个实例独立，支持增删、排序、隐藏和动态内容。
- `ResizeObserver` 感知容器、图片、字体和内容尺寸变化，动画帧内批量测量与定位。
- 容器保留实际内容高度，支持页面滚动和局部滚动区域。
- 支持 SSR；服务端先输出正常文档流，客户端挂载后布局。
- TypeScript 类型、ESM / CommonJS 构建；Vue **3.3+**。
- 没有配色、圆角、阴影、入场动画或图片样式。演示页的视觉设计不属于组件默认样式。

## 安装

```sh
npm install vue-biu-waterfall
```

## 基本使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WaterfallContainer, WaterfallCell } from 'vue-biu-waterfall'
import 'vue-biu-waterfall/style.css'

const cards = ref([
  { id: 'one', title: '短内容', body: '卡片高度由内容决定。' },
  { id: 'two', title: '长内容', body: '文字展开、图片加载和父容器宽度变化都会自动触发布局。' },
])
</script>

<template>
  <WaterfallContainer :column-width="240" :gap="16">
    <WaterfallCell v-for="card in cards" :key="card.id">
      <article class="my-card">
        <h2>{{ card.title }}</h2>
        <p>{{ card.body }}</p>
      </article>
    </WaterfallCell>
  </WaterfallContainer>
</template>
```

使用稳定的业务 ID 作为 Vue `key`，不需要连续的数字下标。卡片数据没有必填字段，组件不会修改它。`WaterfallCell` 应直接放在容器的默认插槽中；也可以抽成返回 `WaterfallCell` 的业务组件。

### 图片与尺寸

不知道图片尺寸时，直接放入卡片，加载后会重新测量。图片如何缩放由自己的 CSS 决定，例如 `.my-image { display: block; width: 100%; height: auto; }`。

如果卡片整体就是一张已知尺寸的图片，可提前预留宽高比，减少加载后的位移：

```vue
<WaterfallCell :width="1200" :height="800">
  <img class="my-image" src="/photo.jpg" alt="山间的湖泊" />
</WaterfallCell>
```

`width` / `height` 表示比例，不是最终显示尺寸。若卡片还包含标题、说明文字，通常让整个卡片使用自然高度，在内部图片上设置原始 `width` / `height` 即可。

### 样式由使用者决定

`class`、`style` 和其他 HTML 属性会透传到容器或单元的根元素。组件 CSS 使用 `:where(...)`，选择器优先级为 0，普通类名即可覆盖；没有 `!important`，也不设置子内容的图片、文字、按钮样式。

```vue
<WaterfallContainer class="my-feed" :gap="[24, 16]">
  <WaterfallCell class="my-item">
    <article class="my-card">完全自定义的内容</article>
  </WaterfallCell>
</WaterfallContainer>
```

组件只设置几何布局需要的宽度、位置、`transform`，以及可选的比例高度。容器内部维护定位层和触底哨兵。卡片间距用 `gap`；自定义变换、动画放在卡片内部元素上，避免与布局定位的 `transform` 冲突。没有默认布局动画，也不会修改 DOM 中的阅读或键盘导航顺序。

## API

### WaterfallContainer

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `column-width` | `number` | `240` | 自动选列时的目标最小列宽，实际列宽拉伸填满容器 |
| `columns` | `number` | — | 指定列数，优先于自动列数和 min/max；空间不足时仍会减少列数 |
| `min-columns` | `number` | `1` | 自动布局的最小列数，受可用空间限制 |
| `max-columns` | `number` | 不限 | 自动布局的最大列数；小于 min 时以 min 为准 |
| `gap` | `number \| readonly [number, number]` | `16` | 均匀间距，或 `[行间距, 列间距]`，顺序与 CSS 一致 |
| `loading` | `boolean` | `false` | 加载期间停止触底通知 |
| `has-more` | `boolean` | `true` | 为 false 时停止触底通知 |
| `threshold` | `number` | `200` | 距离滚动边界多少像素时视为触底 |
| `scroll-root` | `HTMLElement \| null` | `null` | 滚动区域元素，应为容器祖先；null 使用浏览器视口 |

自动列数为 `floor((容器宽度 + 列间距) / (目标列宽 + 列间距))`，再应用 min/max 和空间约束。窄容器至少一列，宽度不会因目标列宽而溢出。列数向下取整；非法列宽/列数回退默认值，负值或非有限间距回退为 16，零间距有效。

| 事件 | 参数 | 时机 |
| --- | --- | --- |
| `layout` | `WaterfallLayout` | 测量、定位完成且布局几何变化后 |
| `reach-end` | `WaterfallLayout` | 触底且 `!loading && hasMore` 时 |

`reach-end` 在一次可见周期内只通知一次。离开后再次进入、`loading` 从 true 变 false、或 `has-more` 从 false 变 true 时可以重新通知。如果首屏内容不足，初次挂载也可能通知；每页加载结束仍不足一屏时可继续加载。没有更多数据时应设置 `has-more=false`。

通过模板 ref 可调用 `reflow(): void`，请求在下一个动画帧重新测量。通常不需要手动调用；在没有 `ResizeObserver` 的环境下，组件使用窗口 resize、Vue 更新和媒体 load/error 事件回退，其他外部尺寸变动可手动调用 `reflow()` 或使用 polyfill。

### WaterfallCell

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `width` | `number` | — | 与 height 一起提供时，预留卡片整体比例 |
| `height` | `number` | — | 与 width 一起提供时，预留卡片整体比例 |

两个值必须都为有限正数，否则使用自然内容高度。`display: none` 的卡片不参与布局；显示后重新测量。组件的外壳由布局管理，内部内容和外观由默认插槽决定。

### 加载更多

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { WaterfallContainer, WaterfallCell } from 'vue-biu-waterfall'
import 'vue-biu-waterfall/style.css'

interface Card { id: string; title: string }
const cards = ref<Card[]>([])
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const canLoad = computed(() => !finished.value && !error.value)
let page = 0

async function loadMore() {
  if (loading.value || !canLoad.value) return
  loading.value = true
  try {
    // 根据自己的接口替换这里。
    const response = await fetch(`/api/cards?page=${page + 1}`)
    if (!response.ok) throw new Error('加载失败')
    const result: { items: Card[]; hasMore: boolean } = await response.json()
    cards.value.push(...result.items)
    finished.value = !result.hasMore
    page += 1
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <WaterfallContainer :loading="loading" :has-more="canLoad" @reach-end="loadMore">
    <WaterfallCell v-for="card in cards" :key="card.id">
      <article>{{ card.title }}</article>
    </WaterfallCell>
  </WaterfallContainer>
  <button v-if="error" @click="error = false">重新加载</button>
</template>
```

局部滚动时，在外层元素设置自己的 `height` / `overflow: auto`，并将该元素的模板 ref 传入 `scroll-root`。本仓库示例包含完整用法。

### 纯函数与类型

```ts
import { calculateLayout, resolveLayout } from 'vue-biu-waterfall'
import type { WaterfallLayout, WaterfallContainerInstance } from 'vue-biu-waterfall'

resolveLayout(800, { columnWidth: 240, gap: 16 })
// columns: 3, columnWidth: 256

const layout = calculateLayout([100, 180, 120, 60], 800, { gap: 16 })
// heights 必须是卡片在最终列宽下的实际显示高度。
// 输入不会被修改；非有限或负高度按 0 处理。
```

`WaterfallLayout` 包含 `width`、`height`、`columns`、`columnWidth`、`rowGap`、`columnGap`、`offset`（目前为 0）和 `rects`。每个矩形包含 `left`、`top`、`width`、`height`、`column`。组件事件的矩形按可见卡片的 DOM 顺序排列。

纯布局算法使用最小堆选择最短列，同高时优先左列。组件按帧批量更新，不会逐个写入再读取 DOM。当前版本不包含虚拟滚动，所有传入卡片都会挂载；大数据集建议分页加载。

## 从 v1 迁移到 v2

这是破坏性更新：

| v1 | v2 |
| --- | --- |
| 从 `vue-biu-waterfall/lib` 导入原始源码 | 从 `vue-biu-waterfall` 导入，并加载 `vue-biu-waterfall/style.css` |
| `:water-cell="item"`，必须有 index/width/height/style | 默认插槽 + 稳定 `:key="item.id"`；自然高度不需要任何尺寸属性 |
| `line-gap` / `min-line-gap` / `max-line-gap` / `single-max-width` | `column-width` / `columns` / `min-columns` / `max-columns` / `gap`，含义重新设计，无一一对应换算 |
| `scrollToBottom` | `reach-end`，参数从列数变为 `WaterfallLayout`，通过 `.columns` 读取列数 |
| `allThingDone` / 外部布局锁 | `layout` 表示几何变化完成；请求状态用 `loading` / `has-more` |
| `interval` / 文档中的 `watch` | 自动观察尺寸和 Vue 更新，按动画帧合并；必要时调用 `reflow()` |
| 全局定位与内置过渡 | 容器内定位；外观与动画自行设置 |

旧全局类型 `WaterfallCell`、`WaterfallConfig`、`Rectangle` 已移除。公开类型现在从包入口显式导入。

## 开发

推荐 Node.js 22.13+。

```sh
npm ci
npm run dev          # 交互示例
npm test             # 算法、组件生命周期、SSR 回归测试
npm run typecheck
npm run build        # 库、CSS、ESM/CJS 类型声明
npm run build:demo   # 示例站点，输出 demo-dist
npm run preview      # 预览已构建示例
npm pack --dry-run   # 检查发布内容，自动先构建
```

演示页使用本地确定性数据和 SVG，包含动态高度、增删排序、多个独立实例、局部滚动加载。

## License

[MIT](LICENSE)。最初实现受到 [myst729/Waterfall](https://github.com/myst729/Waterfall) 和 [MopTym/vue-waterfall](https://github.com/MopTym/vue-waterfall) 启发。
