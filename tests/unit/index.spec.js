describe('index.js', () => {
  it('Exports VueAzureAppConfiguration plugin', () => {
    const library = require('@/index')
    expect(library.VueAzureAppConfiguration).toBeDefined()
  })
})
