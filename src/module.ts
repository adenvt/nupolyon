import {
  defineNuxtModule,
  addPlugin,
  addServerHandler,
  createResolver
} from '@nuxt/kit'
import { joinURL, withQuery } from 'ufo'
import polyfillist from 'polyfillist'

type AnyString = (string & Record<never, never>)

// Module options TypeScript inteface definition
export interface ModuleOptions {
  target?: string | string[],
  host?: 'selfhost' | AnyString,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name     : 'nupolyon',
    configKey: 'nupolyon',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    host: 'https://polyfill.io/v3/polyfill.min.js',
  },
  async setup (options, nuxt) {
    const resolver   = createResolver(import.meta.url)
    const features   = await polyfillist(options.target)
    const isSelfHost = options.host === 'selfhost'
    const src        = options.host && !isSelfHost
      ? withQuery(options.host, { features: features.join(',') })
      : joinURL(nuxt.options.app.baseURL, '/_nupolyon/polyfill')

    nuxt.options.runtimeConfig.nupolyon        = { features }
    nuxt.options.runtimeConfig.public.nupolyon = { src }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    if (isSelfHost) {
      addServerHandler({
        method : 'get',
        route  : '/_nupolyon/polyfill',
        handler: resolver.resolve('./runtime/selfhost')
      })
    }
  }
})
