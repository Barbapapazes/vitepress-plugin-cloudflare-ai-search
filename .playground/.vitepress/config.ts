import { defineConfig } from 'vitepress'
import { cloudflareAISearch } from 'vitepress-plugin-cloudflare-ai-search'
import { cloudflareAISearchSync } from 'cloudflare-ai-search-sync/vitepress'

export default defineConfig({
  title: 'VitePress Playground',
  description: 'A standalone VitePress playground.',
  buildEnd: cloudflareAISearchSync({
    enabled: true,
  }),
  vite: {
    plugins: [
      cloudflareAISearch({
        endpoint: 'https://search.vitepress-plugin-cloudflare-ai-search.barbapapazes.dev',
      }),
    ],
  },
})
