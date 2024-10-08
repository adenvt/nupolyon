import polyfill from '@mrhenry/polyfill-library'
import UA from '@financial-times/polyfill-useragent-normaliser'
import { useRuntimeConfig } from '#imports'
import {
  defineEventHandler,
  getHeader,
  setHeader,
} from 'h3'

export default defineEventHandler(async (event) => {
  const config   = useRuntimeConfig()
  const features = (config.nupolyon.features ?? ['default'])
  const ua       = getHeader(event, 'User-Agent')

  // Set proper mimetype for response
  setHeader(event, 'Content-Type', 'application/javascript; charset=utf-8')

  // Add cache headers
  setHeader(event, 'Cache-Control', `max-age=${String(config.nupolyon.maxAge)}`)
  setHeader(event, 'Expires', new Date(Date.now() + (config.nupolyon.maxAge * 1000)).toUTCString())

  return await polyfill.getPolyfillString({
    ua      : new UA(ua),
    minify  : config.nupolyon.minify,
    features: Object.fromEntries(features.map((feature) => {
      return [feature, { flags: ['gated'] }]
    })),
  })
})
