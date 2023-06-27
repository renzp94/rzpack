module.exports = {
  plugins: ['perfectionist'],
  rules: {
    'perfectionist/sort-array-includes': [
      'error',
      {
        'spread-last': true,
      },
    ],
    'perfectionist/sort-classes': 'error',
    'perfectionist/sort-enums': 'error',
    'perfectionist/sort-exports': 'error',
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'natural',
        groups: [
          ['type', 'builtin-type', 'internal-type', 'parent-type', 'sibling-type', 'index-type'],
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
          'side-effect',
          'style',
          'object',
          'unknown',
        ],
        'internal-pattern': ['@/**'],
      },
    ],
    'perfectionist/sort-interfaces': 'error',
    'perfectionist/sort-jsx-props': 'error',
    'perfectionist/sort-named-exports': 'error',
    'perfectionist/sort-named-imports': 'error',
    'perfectionist/sort-object-types': 'error',
    'perfectionist/sort-objects': 'error',
    'perfectionist/sort-union-types': 'error',
  },
}
