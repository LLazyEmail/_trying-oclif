/**
 * Minimal flat ESLint config (eslint 9+/10).
 * Keeps `npm run lint` and `llazy lint` from crashing.
 * Expand with typescript-eslint in a follow-up.
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
]
