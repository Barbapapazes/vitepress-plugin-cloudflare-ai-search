import { defineConfig } from 'tsdown'

export default defineConfig({
  copy: [
    {
      from: 'src/client/**/*',
      to: 'dist',
      flatten: false,
    },
  ],
})
