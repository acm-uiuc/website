/** @type {import("prettier").Config} */
export default {
  trailingComma: 'es5',
  tabWidth: 2, // Changed from 'space'
  semi: true,
  singleQuote: true,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-packagejson'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
