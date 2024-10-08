import type { NitroAppPlugin } from 'nitropack'
import { joinURL, cleanDoubleSlashes } from 'ufo'
import { useRuntimeConfig } from '#imports'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default <NitroAppPlugin> function (nitroApp) {
  const config = useRuntimeConfig()

  const {
    src,
    isSelfHost,
  } = config.nupolyon

  const host = isSelfHost
    ? cleanDoubleSlashes(joinURL(config.app.baseURL, src))
    : src

  if (host) {
    const preload  = `<link rel="preload" href="${host}" crossorigin="anonymous" as="script" data-testid="nupolyon-preload" />`
    const polyfill = `<script src="${host}" crossorigin="anonymous" data-testid="nupolyon-script"></script>`

    nitroApp.hooks.hook('render:html', (html) => {
      // Inject after meta header and before others script
      const i = html.head.findIndex((i) => i.includes('<link rel="modulepreload" as="script"'))

      if (i !== -1) {
        const head = html.head[i]
        const j    = head.indexOf('<link rel="modulepreload" as="script"')

        html.head[i] = `${head.slice(0, j)}\n${preload}\n${polyfill}\n${head.slice(j)}`
      }
    })
  }
}
