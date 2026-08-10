---
layout: home

hero:
  name: VitePress
  text: Playground
  tagline: A standalone VitePress project for experimenting with this workspace.
  actions:
    - theme: brand
      text: Markdown examples
      link: /markdown-examples
    - theme: alt
      text: API examples
      link: /api-examples
---

## Cloudflare AI Search

The navbar search is wired to the local `vitepress-plugin-cloudflare-ai-search` package.

Set `CLOUDFLARE_AI_SEARCH_ENDPOINT` in `.env` to a public Cloudflare AI Search endpoint root to search real content. The placeholder endpoint lets the playground build before an instance is configured.
