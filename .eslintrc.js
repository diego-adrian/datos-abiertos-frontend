module.exports = {
  root: true,

  env: {
    node: true
  },

  settings: {
    'import/extensions': ['.js', '.jsx', '.mjs', '.vue']
  },

  extends: ['plugin:vue/essential', '@vue/airbnb'],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['error', 'single'],
    'comma-dangle': 'off',
    'no-param-reassign': 'off',
    'space-before-function-paren': 'off',
    'no-use-before-define': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'no-shadow': 'off',
    'object-shorthand': 'off',
    'max-len': 'off',
    'arrow-parens': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'array-callback-return': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/valid-v-on': 'off',
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true
      }
    ],
    'no-prototype-builtins': 'off',
    'no-return-assign': 'off',
    'no-bitwise': 'off',
    'no-async-promise-executor': 'off',
    'operator-assignment': 'off',
    'no-else-return': 'off',
    'no-restricted-globals': 'off',
    radix: 'off',
    'prefer-template': 'off',
    'one-var': 'off',
    'one-var-declaration-per-line': 'off',
    'no-lonely-if': 'off',
    'no-mixed-operators': 'off',
    'object-curly-newline': 'off',
    'no-unused-expressions': 'off'
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
