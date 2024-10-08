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
   * Selfhost configuration
   */
  selfhost?: {
    /**
     * Selfhost route path
     * @default '/_nupolyon/polyfill'
     */
    path?: string,
    /**
     * Selfhost cache max-age
     * @default 2592000 // 1 month
     */
    maxAge?: number,
    /**
     * Enable minify script
     * @default true // on production only
     */
    minify?: boolean,
  },
}

export interface ModuleRuntimeConfig {
  nupolyon: {
    features: string[],
    maxAge: number,
    minify: boolean,
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
    host    : 'selfhost',
    selfhost: {
      path  : '/_nupolyon/polyfill',
      maxAge: 60 * 60 * 24 * 30,
    },
  },
  async setup (options, nuxt) {
    const resolver   = createResolver(import.meta.url)
    const features   = await resolveFeatures(options)
    const maxAge     = options.selfhost?.maxAge as number
    const minify     = options.selfhost?.minify ?? !nuxt.options.dev
    const isSelfHost = options.host === 'selfhost'
    const src        = options.host && !isSelfHost
      ? withQuery(options.host, { features: features.join(',') })
      : options.selfhost?.path as string

    nuxt.options.runtimeConfig.nupolyon = {
      features,
      maxAge,
      minify,
      src,
      isSelfHost,
    }

    addServerPlugin(resolver.resolve('./runtime/server/plugins/polyfill'))

    if (isSelfHost) {
      addServerHandler({
        method : 'get',
        route  : options.selfhost?.path,
        handler: resolver.resolve('./runtime/server/route/selfhost'),
      })
    }

    extendViteConfig((config) => {
      if (config.build)
        config.build.target = browserslistToEsbuild(options.target)
    })
  },
})
