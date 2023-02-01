module.exports = {
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  },
  presets: [
    '@babel/preset-env',
    '@vue/cli-plugin-babel/preset'
  ],
  targets: {
    node: 'current'
  }
}
