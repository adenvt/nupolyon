import {
  defineNuxtPlugin,
  useRuntimeConfig ,
  useHead
} from '#app'
import { joinURL, cleanDoubleSlashes } from 'ufo'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const { src, isSelfHost } = config.public.nupolyon
  // Prepend the current runtime value of app.baseURL if configured for self-hosting
  const host = !isSelfHost ? src : cleanDoubleSlashes(joinURL(config.app.baseURL, src))

  if (host) {
    useHead({
      link: [
        {
          rel        : 'preload',
          as         : 'script',
          crossorigin: 'anonymous',
          href       : host,
        }
      ],
      script: [
        {
          src        : host,
          defer      : true,
          crossorigin: 'anonymous',
        }
      ]
    })
  }
})
