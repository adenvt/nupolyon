import type { NitroAppPlugin } from 'nitropack'
import { joinURL, cleanDoubleSlashes } from 'ufo'
import { useRuntimeConfig } from "#imports";

export default <NitroAppPlugin> function (nitroApp) {
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
}
