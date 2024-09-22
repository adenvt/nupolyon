import type { NitroAppPlugin } from 'nitropack'
import { joinURL, cleanDoubleSlashes } from 'ufo'
import { useRuntimeConfig } from '#imports'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default <NitroAppPlugin> function (nitroApp) {
  const config = useRuntimeConfig()

  const {
    src,
    isSelfHost,
  } = config.public.nupolyon

  const host = isSelfHost
    ? cleanDoubleSlashes(joinURL(config.app.baseURL, src))
    : src

  if (host) {
    const preload  = `<link rel="preload" href="${host}" crossorigin="anonymous" as="script" data-testid="nupolyon-preload" />`
    const polyfill = `<script src="${host}" crossorigin="anonymous" data-testid="nupolyon-script"></script>`

    nitroApp.hooks.hook('render:html', (html) => {
      html.head.unshift(preload, polyfill) // insert at the beginning of the array
    })
  }
}
