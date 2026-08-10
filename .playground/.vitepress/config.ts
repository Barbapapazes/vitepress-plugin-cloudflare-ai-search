import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitepress'
import { cloudflareAISearch } from 'vitepress-cloudflare-ai-search'

const playgroundRoot = fileURLToPath(new URL('..', import.meta.url))
const env = loadEnv('development', playgroundRoot, '')
const endpoint = env.CLOUDFLARE_AI_SEARCH_ENDPOINT || 'https://search.example.com'

export default defineConfig({
  title: 'VitePress Playground',
  description: 'A standalone VitePress playground.',
  vite: {
    plugins: [
      cloudflareAISearch({
        endpoint, // It's a public URL so in real world usage, you can hardcode it.
      }),
    ],
  },
})
