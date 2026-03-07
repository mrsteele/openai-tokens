const getModel = require('./models')

describe('getModel', () => {
  test('should default to gpt-3.5-turbo', () => {
    console.warn = jest.fn()
    expect(getModel('nonexistent')).toMatchObject(getModel('gpt-3.5-turbo'))
    expect(console.warn.mock.calls[0][0]).toMatch(/nonexistent/)
  })

  test('should detect from table the correct data', () => {
    expect(getModel('gpt-4.1')).toMatchObject({
      tokens: 128000,
      price: 0.000002
    })
  })

  test('should resolve dated variants from patterns', () => {
    expect(getModel('gpt-4.1-mini-2025-04-14')).toMatchObject({
      tokens: 128000,
      price: 0.0000004
    })
  })

  test('should support runtime model registration', () => {
    getModel.registerModel('acme-model-1', { tokens: 2048, price: 0.00000001 })
    expect(getModel('acme-model-1')).toMatchObject({
      tokens: 2048,
      price: 0.00000001
    })
  })
})
