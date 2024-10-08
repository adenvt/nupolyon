export default defineNuxtConfig({
  modules : ['../src/module'],
  nupolyon: {
    host: 'selfhost',
    features (features) {
      return features.filter((feat) => !feat.startsWith('console'))
    },
  },
  app: { head: { title: 'Nupolyon Example' } },
})
