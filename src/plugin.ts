import type { Plugin, ResolvedConfig } from 'vite'
import type { CloudflareAISearchOptions } from './options.js'
import { fileURLToPath } from 'node:url'
import { normalizeOptions, serializeOptions } from './options.js'

const virtualModuleId = 'virtual:vitepress-plugin-cloudflare-ai-search/options'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

/**
 * Replace VitePress's default-theme search component with Cloudflare AI Search.
 */
export function cloudflareAISearch(options: CloudflareAISearchOptions): Plugin {
  const normalizedOptions = normalizeOptions(options)
  const serializedOptions = serializeOptions(normalizedOptions)
  const adapterPath = fileURLToPath(
    new URL('./client/VPNavBarSearch.vue', import.meta.url),
  )

  return {
    name: 'vitepress-plugin-cloudflare-ai-search',
    enforce: 'pre',

    config() {
      return {
        resolve: {
          alias: [
            {
              find: /^.*[\\/]VPNavBarSearch\.vue$/,
              replacement: adapterPath,
            },
          ],
        },
      }
    },

    configResolved(config: ResolvedConfig) {
      if (
        hasEnabledDefine(config, '__VP_LOCAL_SEARCH__')
        || hasEnabledDefine(config, '__ALGOLIA__')
      ) {
        config.logger.warn(
          '[vitepress-plugin-cloudflare-ai-search] `themeConfig.search` is also configured. The VitePress local or Algolia search UI is replaced by Cloudflare AI Search, so its provider configuration is unused.',
        )
      }
    },

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${serializedOptions}`
      }
    },
  }
}

function hasEnabledDefine(config: ResolvedConfig, key: string): boolean {
  const value = config.define?.[key]
  return value === true || value === 'true'
}
