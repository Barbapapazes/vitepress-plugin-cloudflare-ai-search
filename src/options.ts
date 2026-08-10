import type {
  SearchRequestOptions,
  SearchSnippetProps,
  Theme,
  Translations,
} from '@cloudflare/ai-search-snippet'

export type { SearchRequestOptions, Theme, Translations }

export type SearchSnippetCssVariable = `--search-snippet-${string}`

export type SearchSnippetCssVariables = Partial<
  Record<SearchSnippetCssVariable, string>
>

export interface CloudflareAISearchOptions
  extends Pick<
    SearchSnippetProps,
    | 'placeholder'
    | 'maxResults'
    | 'maxRenderResults'
    | 'debounceMs'
    | 'theme'
    | 'hideBranding'
    | 'showUrl'
    | 'showDate'
    | 'hideThumbnails'
    | 'seeMore'
    | 'groupBy'
    | 'disableAnalytics'
    | 'translations'
  > {
  /** Public AI Search endpoint root, without the `/search` path. */
  endpoint: string
  /** Keyboard shortcut key used by the modal. Defaults to `k`. */
  shortcut?: string
  /** Require the Meta key as well as Control on macOS. Defaults to `true`. */
  useMetaKey?: boolean
  /** Additional public request fields, headers, and query parameters. */
  requestOptions?: SearchRequestOptions
  /** CSS custom properties forwarded to the Cloudflare component host. */
  cssVariables?: SearchSnippetCssVariables
}

export interface NormalizedCloudflareAISearchOptions
  extends CloudflareAISearchOptions {
  endpoint: string
}

export function normalizeOptions(
  options: CloudflareAISearchOptions,
): NormalizedCloudflareAISearchOptions {
  if (!options || typeof options !== 'object') {
    throw new TypeError(
      '[vitepress-plugin-cloudflare-ai-search] options must be an object.',
    )
  }

  const endpoint = normalizeEndpoint(options.endpoint)
  validateCssVariables(options.cssVariables)

  return {
    ...options,
    endpoint,
  }
}

export function serializeOptions(
  options: NormalizedCloudflareAISearchOptions,
): string {
  try {
    const serialized = JSON.stringify(options, (_key, value) => {
      if (
        typeof value === 'bigint'
        || typeof value === 'function'
        || typeof value === 'symbol'
      ) {
        throw new TypeError(`unsupported ${typeof value} value`)
      }

      return value
    })

    if (!serialized) {
      throw new TypeError('options could not be serialized')
    }

    return serialized
  }
  catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new TypeError(
      `[vitepress-plugin-cloudflare-ai-search] options must be JSON serializable: ${reason}`,
      { cause: error },
    )
  }
}

function normalizeEndpoint(value: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(
      '[vitepress-plugin-cloudflare-ai-search] `endpoint` must be a non-empty URL.',
    )
  }

  const input = value.trim()
  let url: URL

  try {
    url = new URL(input)
  }
  catch {
    throw new TypeError(
      `[vitepress-plugin-cloudflare-ai-search] invalid endpoint URL: ${input}`,
    )
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError(
      '[vitepress-plugin-cloudflare-ai-search] `endpoint` must use http or https.',
    )
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new TypeError(
      '[vitepress-plugin-cloudflare-ai-search] `endpoint` must be a public endpoint root without credentials, query parameters, or a hash.',
    )
  }

  const path = url.pathname.replace(/\/+$/, '')
  if (path === '/search') {
    throw new TypeError(
      '[vitepress-plugin-cloudflare-ai-search] `endpoint` must be the endpoint root, not the `/search` URL.',
    )
  }

  return url.toString().replace(/\/+$/, '')
}

function validateCssVariables(
  variables: SearchSnippetCssVariables | undefined,
): void {
  if (variables === undefined) {
    return
  }

  if (!variables || typeof variables !== 'object' || Array.isArray(variables)) {
    throw new TypeError(
      '[vitepress-plugin-cloudflare-ai-search] `cssVariables` must be an object.',
    )
  }

  for (const [name, value] of Object.entries(variables)) {
    if (!name.startsWith('--search-snippet-')) {
      throw new TypeError(
        `[vitepress-plugin-cloudflare-ai-search] invalid CSS variable '${name}'; names must start with '--search-snippet-'.`,
      )
    }

    if (typeof value !== 'string') {
      throw new TypeError(
        `[vitepress-plugin-cloudflare-ai-search] CSS variable '${name}' must have a string value.`,
      )
    }
  }
}
