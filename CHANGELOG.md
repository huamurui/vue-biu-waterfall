# Changelog

## 2.0.0

### Breaking changes

- 从包根入口导入组件，单独引入 `vue-biu-waterfall/style.css`。发布 ESM、CommonJS 和对应的类型声明；Vue 最低版本为 3.3。
- 移除 `waterCell`、全局数据类型和基于连续 index 的注册。卡片使用默认插槽及 Vue key，宽高比例为可选属性。
- 使用 columnWidth、columns、minColumns、maxColumns、gap 替换旧布局配置。
- 使用 layout、reach-end 事件和 loading、hasMore 加载状态替换旧事件与布局锁。
- 移除内置动画，外观由使用者控制。基础 CSS 使用低优先级选择器，不设置图片或文本样式。

### Improvements

- 实例独立的注册与清理，支持多实例、增删、重排、隐藏恢复。
- 根据容器宽度布局，测量自然高度，响应图片、字体和动态内容变化。
- 正确维护容器高度；支持 SSR 初始文档流及局部滚动触底加载。
- 帧内批量更新，最小堆计算最短列，非法数值与窄容器保护。
- 修复祖先缩放影响高度测量、位置变化未更新、父级数据被修改等问题。
- 加入算法、组件和 SSR 回归测试、CI、发布产物校验，以及离线交互示例。

迁移细节见 [README](README.md#从-v1-迁移到-v2)。
