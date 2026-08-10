import type { CloudflareAISearchOptions, NormalizedCloudflareAISearchOptions } from '../src/options.js'
import { describe, expect, it } from 'vitest'
import { normalizeOptions, serializeOptions } from '../src/options.js'

const endpoint = 'https://search.example.com'

describe('normalizeOptions', () => {
  it('normalizes an endpoint and preserves valid options', () => {
    expect(normalizeOptions({
      endpoint: ` ${endpoint}/// `,
      placeholder: 'Search documentation',
      cssVariables: {
        '--search-snippet-primary-color': '#646cff',
      },
    })).toEqual({
      endpoint,
      placeholder: 'Search documentation',
      cssVariables: {
        '--search-snippet-primary-color': '#646cff',
      },
    })
  })

  it.each([
    undefined,
    '',
    '   ',
    'not a URL',
    'ftp://search.example.com',
    'https://user:password@search.example.com',
    `${endpoint}?query=value`,
    `${endpoint}#section`,
    `${endpoint}/search`,
  ])('rejects an invalid endpoint: %s', (invalidEndpoint) => {
    expect(() => normalizeOptions({ endpoint: invalidEndpoint } as CloudflareAISearchOptions)).toThrow(TypeError)
  })

  it('rejects invalid CSS variables', () => {
    expect(() => normalizeOptions({
      endpoint,
      cssVariables: {
        '--not-a-search-variable': '#646cff',
      } as CloudflareAISearchOptions['cssVariables'],
    })).toThrow(/names must start with '--search-snippet-'/)

    expect(() => normalizeOptions({
      endpoint,
      cssVariables: [] as unknown as CloudflareAISearchOptions['cssVariables'],
    })).toThrow('`cssVariables` must be an object')
  })
})

describe('serializeOptions', () => {
  it('serializes normalized options for the virtual module', () => {
    const options = normalizeOptions({
      endpoint,
      requestOptions: {
        headers: {
          'X-Client': 'vitepress',
        },
      },
    })

    expect(JSON.parse(serializeOptions(options))).toEqual(options)
  })

  it.each([
    { unsupported: () => undefined },
    { unsupported: Symbol('unsupported') },
    { unsupported: 1n },
  ])('rejects unsupported values', (unsupported) => {
    expect(() => serializeOptions({
      endpoint,
      ...unsupported,
    } as NormalizedCloudflareAISearchOptions)).toThrow('must be JSON serializable')
  })

  it('rejects circular options', () => {
    const options: NormalizedCloudflareAISearchOptions & { circular?: unknown } = { endpoint }
    options.circular = options

    expect(() => serializeOptions(options)).toThrow('must be JSON serializable')
  })
})
