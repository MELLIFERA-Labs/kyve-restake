module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },

  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': ['warn', { allow: ['info'] }],
    indent: ['error', 2],
    'no-unused-vars': ['error', {
      args: 'all',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }]
  }
}
