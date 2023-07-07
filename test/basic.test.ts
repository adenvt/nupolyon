import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, fetch, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('should render the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('should return selfhosted polyfill with correct mimetype', async () => {
    const res = await fetch('/_nupolyon/polyfill')
    expect(res.headers.get('content-type')).toContain('application/javascript')
  })
})
