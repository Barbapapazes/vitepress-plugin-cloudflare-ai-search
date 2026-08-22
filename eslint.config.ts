import antfu from '@antfu/eslint-config'

export default antfu()
  .override('antfu/pnpm/pnpm-workspace-yaml', {
    rules: {
      'pnpm/yaml-enforce-settings': ['error', {
        settings: {
          shellEmulator: true,
          trustPolicy: 'off',
        },
      }],
    },
  })
