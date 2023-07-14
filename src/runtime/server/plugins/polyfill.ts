import { joinURL, cleanDoubleSlashes } from 'ufo'
import { useRuntimeConfig } from "#imports";

/**
 * Due to an upstream bug in Nuxt 3 we need to stub the `defineNitroPlugin`.
 * See https://github.com/nuxt/nuxt/issues/18556
 *
 * Once this issue is resolved, then this file can be updated to the following:
 *
 * ```ts
 * import { defineNitroPlugin } from '#imports'
 * ```
 */
import { NitroApp } from 'nitropack'

export type NitroAppPlugin = (nitro: NitroApp) => void
export function defineNitroPlugin (def: NitroAppPlugin): NitroAppPlugin {
  return def
}
/**
 * End of workaround
 */

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()

  const { src, isSelfHost } = config.public.nupolyon
  // Prepend the current runtime value of app.baseURL if configured for self-hosting
  const host = !isSelfHost ? src : cleanDoubleSlashes(joinURL(config.app.baseURL, src))

  if (host) {
    const preload  = `<link rel="preload" href="${host}" crossorigin="anonymous" as="script" data-testid="nupolyon-preload" />`
    // NOTE: We intentionally omit type="module" here because it will defer the execution of the polyfill
    const polyfill = `<script src="${host}" crossorigin="anonymous" data-testid="nupolyon-script"></script>`

    nitroApp.hooks.hook('render:html', (html) => {
      html.head.unshift(preload, polyfill)  // insert at the beginning of the array
    })
  }
})
