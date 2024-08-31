/** @type {import('prettier').Config} */

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'],
}
