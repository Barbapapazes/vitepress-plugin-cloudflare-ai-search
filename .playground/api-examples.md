# API Examples

## TypeScript

```ts
interface SearchResult {
  title: string
  url: string
}

export function formatResult(result: SearchResult) {
  return `${result.title}: ${result.url}`
}
```

## JSON

```json
{
  "query": "vitepress",
  "limit": 10
}
```
