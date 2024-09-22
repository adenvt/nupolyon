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

  return await polyfill.getPolyfillString({
    ua      : new UA(ua),
    minify  : true,
    features: Object.fromEntries(features.map((feature) => {
      return [feature, { flags: ['gated'] }]
    })),
  })
})
