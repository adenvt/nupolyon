import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, fetch, $fetch } from '@nuxt/test-utils'
import cheerio from 'cheerio'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('should inject the polyfill script into page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    const $    = cheerio.load(html)

    const preload = $('link[data-testid="nupolyon-preload"]')
    const script  = $('script[data-testid="nupolyon-script"]')

    expect(preload.attr('href')).toBe('/_nupolyon/polyfill')
    expect(script.attr('src')).toBe('/_nupolyon/polyfill')
  })

  it('should return selfhosted polyfill with correct mimetype', async () => {
    const res = await fetch('/_nupolyon/polyfill')
    expect(res.headers.get('content-type')).toContain('application/javascript')
  })
})
