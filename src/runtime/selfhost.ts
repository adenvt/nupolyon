import polyfill from 'polyfill-library'
import { useRuntimeConfig } from '#imports'
import {
  defineEventHandler,
  getHeader,
} from 'h3'

export default defineEventHandler((event) => {
  const config   = useRuntimeConfig()
  const features = (config.nupolyon.features ?? ['default']) as string[]
  const ua       = getHeader(event, 'user-agent')

  return polyfill.getPolyfillString({
    uaString: ua,
    minify  : true,
    features: Object.fromEntries(features.map((feature) => {
      return [feature, { flags: ['gated'] }]
    }))
  })
})
