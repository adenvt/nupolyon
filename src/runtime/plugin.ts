import {
  defineNuxtPlugin,
  useRuntimeConfig ,
  useHead
} from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const host   = config.public.nupolyon.src

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
