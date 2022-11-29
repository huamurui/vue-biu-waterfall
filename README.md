# A waterfall layout based on vue3 and typescript(still in developing now)

[![Version](https://img.shields.io/npm/v/vue-biu-waterfall)](https://www.npmjs.com/package/vue-biu-waterfall)
[![License](https://img.shields.io/npm/l/vue-biu-waterfall)](LICENSE)

...and, this repository is inspired by following  two repositories [myst729/Waterfall](https://github.com/myst729/Waterfall),  [MopTym/vue-waterfall](https://github.com/MopTym/vue-waterfall)

## Demo

### [biu~](http://biubiubiu.huamurui.me)

## Installation

```shell
npm install --save vue-biu-waterfall
```

### Import

#### vue3 + setup + ts

```ts
import WaterfallConfig from './components/WaterfallConfig.vue'
import WaterfallCell from './components/WaterfallCell.vue'

// these two are for ... 
const config = {
  interval: ...
  lineGap: ...
  minLineGap: ...
  maxLineGap: ...
  singleMaxWidth: ...
}
let items = ...

const reflow= ...
const reflowed = ...
```

### template structure

```html
    <WaterfallConfig :waterfallConfig="config" @scrollToBottom="reflow" @allThingDone="reflowed">
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <div>
           {{ item.lalala }} 
           <!-- and you can put more things in this div, such as <img src="item.url">...... -->
        </div>
      </WaterfallCell>
    </WaterfallConfig>

```

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

Name | Default | Description
---- | ---- | ----
item | ---- | ----
item.index | ---- | ----
item.width | ---- | ----
item.height |=line-gap |---
item.style | ---- | ----

Here we directly pass the object into waterfallCell, but the object should have flowing features:\
height, width, index, style. the style could be empty, but still needed.

## Transition

## Events

## Reactivity

## License

Released under the [MIT](LICENSE) License.
