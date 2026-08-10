# vitepress-plugin-cloudflare-ai-search

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![pkg.pr.new](https://pkg.pr.new/badge/Barbapapazes/vitepress-plugin-cloudflare-ai-search)](https://pkg.pr.new/~/Barbapapazes/vitepress-plugin-cloudflare-ai-search)

Replace the VitePress default-theme search with [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/).

- 🔎 **Native VitePress integration**: Replaces the default navbar search surface without changing your theme.
- ☁️ **Cloudflare-powered search**: Uses Cloudflare's official `search-modal-snippet` component for search, results, favorites, and analytics.
- ⌨️ **Keyboard ready**: Opens with Cloudflare's built-in `Cmd/Ctrl+K` shortcut.
- 🌗 **Theme aware**: Follows VitePress light and dark mode unless you choose a theme explicitly.
- 🖥️ **SSR safe**: Loads Cloudflare's browser-only component after mount.

## Installation

```bash
pnpm add vitepress-plugin-cloudflare-ai-search
```

## Usage

Add the plugin to the VitePress `vite.plugins` array:

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { cloudflareAISearch } from 'vitepress-plugin-cloudflare-ai-search'

export default defineConfig({
  vite: {
    plugins: [
      cloudflareAISearch({
        endpoint: 'https://search.example.com',
      }),
    ],
  },
})
```

> [!NOTE]
> Do not configure `themeConfig.search`. This plugin replaces VitePress's local or Algolia search UI.

The required `endpoint` is the public AI Search endpoint root. It must use `http` or `https` and must not include credentials, query parameters, a hash, or the `/search` path. Redundant trailing slashes are removed automatically.

## Options

All Cloudflare modal settings are optional and use Cloudflare's defaults when omitted.

```ts
cloudflareAISearch({
  endpoint: 'https://search.example.com',
  placeholder: 'Search the docs',
  theme: 'auto',
  maxResults: 10,
  disableAnalytics: true,
  cssVariables: {
    '--search-snippet-primary-color': '#646cff',
  },
})
```

| Option | Description |
| --- | --- |
| `endpoint` | **Required.** Public AI Search endpoint root. |
| `placeholder`, `maxResults`, `maxRenderResults`, `debounceMs` | Search input and result-list behavior. |
| `theme` | `light`, `dark`, or `auto`. Omit it to synchronize with VitePress. |
| `hideBranding`, `showUrl`, `showDate`, `hideThumbnails`, `groupBy`, `seeMore` | Cloudflare search result presentation. |
| `shortcut`, `useMetaKey` | Keyboard shortcut customization. Defaults to `k` and `true`. |
| `requestOptions` | Additional **public** request fields, headers, and query parameters. |
| `disableAnalytics` | Disables Cloudflare analytics. Analytics are enabled by default. |
| `translations` | Cloudflare modal translations. `searchButtonLabel` also controls the navbar label. |
| `cssVariables` | `--search-snippet-*` properties forwarded to the component host for Shadow DOM styling. |

The navbar label uses `translations.searchButtonLabel`, then `placeholder`, then `Search`.

> [!WARNING]
> The endpoint and every option are sent to the browser. AI Search endpoints are public browser endpoints, so never add API tokens, `Authorization` values, Cloudflare Access service-token secrets, or other credentials to `requestOptions`.

## Cloudflare setup

Create and configure an AI Search instance in Cloudflare, enable its public `/search` endpoint, and add your development and production origins to its authorized hosts. Index only content that is safe to expose publicly.

Review your plan's rate limits, query quotas, indexing delay, analytics behavior, and Access limitations. If you configure content selectors, verify that they match your rendered VitePress main-content selector.

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/barbapapazes">
    <img src="https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg" alt="Sponsors" />
  </a>
</p>

## License

[MIT](./LICENSE) License © 2026-PRESENT [Estéban Soubiran](https://github.com/Barbapapazes)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vitepress-plugin-cloudflare-ai-search/latest.svg?style=flat&colorA=000&colorB=171717
[npm-version-href]: https://npmjs.com/package/vitepress-plugin-cloudflare-ai-search

[npm-downloads-src]: https://img.shields.io/npm/dm/vitepress-plugin-cloudflare-ai-search.svg?style=flat&colorA=000&colorB=171717
[npm-downloads-href]: https://npmjs.com/package/vitepress-plugin-cloudflare-ai-search

[license-src]: https://img.shields.io/npm/l/vitepress-plugin-cloudflare-ai-search.svg?style=flat&colorA=000&colorB=171717
[license-href]: https://npmjs.com/package/vitepress-plugin-cloudflare-ai-search
