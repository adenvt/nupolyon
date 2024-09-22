import {
  defineNuxtModule,
  addServerHandler,
  createResolver,
  extendViteConfig,
  addServerPlugin,
} from '@nuxt/kit'
import { withQuery } from 'ufo'
import polyfillist from 'polyfillist'
import browserslistToEsbuild from 'browserslist-to-esbuild'

type AnyString = (string & Record<never, never>)

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Browserslist target
   */
  target?: string | string[],
  /**
   * Polyfill host
   * @default 'selfhost'
   */
  host?: 'selfhost' | AnyString,
  /**
   * List of features to enable
   */
  features?: string[] | ((features: string[]) => string[] | Promise<string[]>),
  /**
   * Selfhost route path
   * @default '/_nupolyon/polyfill'
   */
  selfhostPath?: string,
}

export interface ModuleRuntimeConfig {
  nupolyon: {
    features: string[],
  },
}

export interface ModulePublicRuntimeConfig {
  nupolyon: {
    src: string,
    isSelfHost: boolean,
  },
}

async function resolveFeatures (options: ModuleOptions): Promise<string[]> {
  if (typeof options.features === 'function')
    return await options.features(await polyfillist(options.target))

  if (Array.isArray(options.features))
    return options.features

  return await polyfillist(options.target)
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name     : 'nupolyon',
    configKey: 'nupolyon',
  },
  defaults: {
    host        : 'selfhost',
    selfhostPath: '/_nupolyon/polyfill',
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const features   = await resolveFeatures(options)
    const isSelfHost = options.host === 'selfhost'
    const src        = options.host && !isSelfHost
      ? withQuery(options.host, { features: features.join(',') })
      : options.selfhostPath as string

    nuxt.options.runtimeConfig.nupolyon        = { features }
    nuxt.options.runtimeConfig.public.nupolyon = { src, isSelfHost }

    addServerPlugin(resolver.resolve('./runtime/server/plugins/polyfill'))

    if (isSelfHost) {
      addServerHandler({
        method : 'get',
        route  : options.selfhostPath,
        handler: resolver.resolve('./runtime/server/route/selfhost'),
      })
    }

    extendViteConfig((config) => {
      if (config.build)
        config.build.target = browserslistToEsbuild(options.target)
    })
  },
})
