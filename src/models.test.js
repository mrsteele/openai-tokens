const getModel = require('./models')

describe('getModel', () => {
  test('should default to gpt-3.5-turbo', () => {
    console.warn = jest.fn()
    expect(getModel('nonexistent')).toMatchObject(getModel('gpt-3.5-turbo'))
    expect(console.warn.mock.calls[0][0]).toMatch(/nonexistent/)
  })

  test('should detect from table the correct data', () => {
    expect(getModel('gpt-4')).toMatchObject({
      tokens: 8192,
      price: 0.00003
    })
  })
})
