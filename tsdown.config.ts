import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'client/snippet': 'src/snippet.mts',
  },
  copy: [
    {
      from: 'src/client/**/*',
      to: 'dist',
      flatten: false,
    },
  ],
  deps: {
    alwaysBundle: ['@cloudflare/ai-search-snippet/search'],
    onlyBundle: false,
  },
})
