// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { WaterfallCell, WaterfallContainer } from '../lib'

describe('server rendering', () => {
  it('renders readable content in normal flow without browser globals', async () => {
    const app = createSSRApp({ render: () => h(WaterfallContainer, null, () => [
      h(WaterfallCell, null, () => 'First card'),
      h(WaterfallCell, { width: 4, height: 3 }, () => 'Second card'),
    ]) })
    const html = await renderToString(app)
    expect(html).toContain('First card')
    expect(html).toContain('Second card')
    expect(html).toContain('position:relative')
    expect(html).not.toContain('position:absolute')
    expect(html).not.toContain('height:0px')
  })
})
