module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'plugin:jest/recommended'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  plugins: ['jest'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'multiline-ternary': 'off'
  },

  overrides: [
    {
      files: [
        'tests/**/*.spec.{j,t}s?(x)',
        'sandbox/**/*.{js,ts,vue}'
      ],
      env: {
        jest: true
      }
    }
  ]
}
