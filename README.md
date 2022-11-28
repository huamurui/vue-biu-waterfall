# A waterfall layout based on vue3 and ts(still in developing now)

[![Version](https://img.shields.io/npm/v/vue-biu-waterfall)](https://www.npmjs.com/package/vue-biu-waterfall)
[![License](https://img.shields.io/npm/l/vue-biu-waterfall)](LICENSE)

## Demo

### [biu~](http://biubiubiu.huamurui.me)

## Installation

```shell
npm install --save vue-waterfall
```

### Import

#### ES6
<!-- 
```js
/* in xxx.vue */

import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

export default {
  ...
  components: {
    Waterfall,
    WaterfallSlot
  },
  ...
}
``` -->

### template structure
<!-- 
```html
<waterfall-config :line-gap="200" :watch="items">
  <!-- each component is wrapped by a waterfall slot -->
  <waterfall-slot
    v-for="(item, index) in items"
    :width="item.width"
    :height="item.height"
    :order="index"
    :key="item.id"
  >
    <!--
      your component
    -->
  </waterfall-slot>
</waterfall-config>
``` -->

## Props

### waterfallConfig

Name | Default | Description
---- | ---- | ----
line-gap | ---- | Required. The standard space (px) between lines.
min-line-gap |=line-gap The minimal space between lines.
max-line-gap| =line-gap The maximal space between lines.
single-max-width| =max-line-gap |The maximal width of slot which is single in horizontal direction.
watch| ----|Watch something, reflow when it changes.
interval|----|The minimal time interval (ms) between reflow actions.

### waterfallCell

<!-- Name | Default | Description
---- | ---- | ----
width | ---- | ----
height |=line-gap |----
key| =line-gap |----
order| =max-line-gap |----
watch| ----|----
move-class| ----|Class for transition -->

## Transition

## Events

## Reactivity

## License

Released under the [MIT](LICENSE) License.
