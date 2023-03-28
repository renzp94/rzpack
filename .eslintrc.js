module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
