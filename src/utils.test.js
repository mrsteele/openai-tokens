const { getTokens, getAllTokens, getLimit } = require('./utils')

describe('getTokens', () => {
  test('should encode a fixed value', () => {
    expect(getTokens('hi')).toBe(1)
  })

  test('should still work when empty', () => {
    expect(getTokens('')).toBe(0)
  })
})

describe('getAllTokens', () => {
  test('should count single messages', () => {
    const tokens = getAllTokens([{
      role: 'user',
      content: 'This is the content'
    }])

    expect(tokens).toBe(4)
  })

  test('should count multiple messages', () => {
    const tokens = getAllTokens([{
      role: 'system',
      content: 'This is the content'
    }, {
      role: 'user',
      content: 'This is the content'
    }])

    expect(tokens).toBe(8)
  })

  test('should count empty messages if they ever happened', () => {
    const tokens = getAllTokens([])
    expect(tokens).toBe(0)
  })
})

describe('getLimit', () => {
  test('should support number arguments', () => {
    const numbers = [0, 1, 100000]
    for (const number of numbers) {
      expect(getLimit(number)).toBe(number)
    }
  })

  test('should support model names', () => {
    expect(getLimit('gpt-3.5-turbo')).toBe(4096)
    expect(getLimit('gpt-4')).toBe(8192)
  })

  test('should default to gpt-3-turbo', () => {
    console.warn = jest.fn()
    expect(getLimit('missing333')).toBe(4096)
    expect(console.warn.mock.calls[0][0]).toBe('The model "missing333" is not currently supported. Defaulting to "gpt-3.5-turbo"')
  })
})
