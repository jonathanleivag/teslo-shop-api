module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-warning-comments': [
      'warn',
      { terms: ['todo', 'fixme', 'xxx', '**', '!', '?'], location: 'start' }
    ],
    'no-undef': 'off',
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    'no-use-before-define': 0
  }
}
