<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nupolyon
- Package name: nupolyon
- Description: Auto-Inject polyfill from https://cdnjs.cloudflare.com/polyfill/
-->

# Nupolyon

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> Auto-Inject polyfill from https://cdnjs.cloudflare.com/polyfill/

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## ⚠️ WARNING

DON'T USE THIS MODULE, POLYFILL.IO HAS BEEN REPORTED INJECTING SOME MALICIOUS CODE.
TEMPORARY WE MOVE THE URL TO CLOUDFLARE'S MIRROR.

https://www.bleepingcomputer.com/news/security/polyfillio-javascript-supply-chain-attack-impacts-over-100k-sites/

https://sansec.io/research/polyfill-supply-chain-attack

https://www.theregister.com/2024/06/25/polyfillio_china_crisis/

https://www.scmagazine.com/brief/over-100k-sites-hit-by-polyfill-io-supply-chain-attack

## Features

<!-- Highlight some of the features your module provide here -->
- ✅ &nbsp;[Automatic detection][polyfillist] based on browserslist target
- ✅ &nbsp;Using [cloudflare polyfill](https://cdnjs.cloudflare.com/polyfill/) CDN, Custom CDN, or Self-Host

See the detailed feature explanation here: [#58 (comment)](https://github.com/adenvt/nupolyon/issues/58#issuecomment-1676713711)

## Quick Setup

```bash
npx nuxi@latest module add nupolyon
```

That's it! You can now use Nupolyon in your Nuxt app ✨

## Configuration

```js
export default defineNuxtConfig({
  modules: [
    'nupolyon'
  ],
  nupolyon: {
    // change host
    host: 'http://my-own-cdn.com/polyfill.min.js',
    // or enable self-host mode
    host: 'selfhost',

    // customize browserslist's target
    target: 'defaults',
  },
})
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

## License

This project published under MIT License, see [LICENSE](/LICENSE) for more details.


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nupolyon/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nupolyon

[npm-downloads-src]: https://img.shields.io/npm/dm/nupolyon.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nupolyon

[license-src]: https://img.shields.io/npm/l/nupolyon.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nupolyon

[polyfillist]: https://github.com/adenvt/polyfillist
