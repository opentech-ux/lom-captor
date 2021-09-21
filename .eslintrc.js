module.exports = {
   env: {
      amd: true,
      browser: true,
      commonjs: true,
      es2020: true,
      jest: true,
      node: true,
   },
   extends: ['airbnb', 'prettier'],
   globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
   },
   parser: '@babel/eslint-parser',
   parserOptions: {
      ecmaVersion: 2020,
   },
   plugins: ['react', 'prettier'],
   root: true,
   rules: {
      'import/prefer-default-export': 'off',
      'no-use-before-define': 'off',
      'prettier/prettier': 'error',
   },
};
