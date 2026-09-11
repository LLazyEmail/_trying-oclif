/**
 * Minimal flat ESLint config so `npm run lint` / `llazy lint` do not crash.
 * Expand later with typescript-eslint rules.
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // Start permissive – tighten in a follow-up PR
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
]
