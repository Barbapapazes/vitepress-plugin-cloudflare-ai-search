import process from 'node:process'
import { cloudflareAISearchSync } from 'cloudflare-ai-search-sync/vitepress'
import { defineConfig } from 'vitepress'
import { cloudflareAISearch } from 'vitepress-plugin-cloudflare-ai-search'

export default defineConfig({
  title: 'VitePress Playground',
  description: 'A standalone VitePress playground.',
  buildEnd: cloudflareAISearchSync({
    enabled: process.env.CI !== 'true',
  }),
  vite: {
    plugins: [
      cloudflareAISearch({
        endpoint: 'https://search.vitepress-plugin-cloudflare-ai-search.barbapapazes.dev',
      }),
    ],
  },
})
