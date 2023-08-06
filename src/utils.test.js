const { getTokens, getAllTokens } = require('./utils')

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
    const tokens = getAllTokens({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: 'This is the content'
      }]
    })

    expect(tokens).toBe(4)
  })

  test('should count multiple messages', () => {
    const tokens = getAllTokens({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'This is the content'
      }, {
        role: 'user',
        content: 'This is the content'
      }]
    })

    expect(tokens).toBe(8)
  })

  test('should count empty messages if they ever happened', () => {
    const tokens = getAllTokens({ mode: '', messages: [] })
    expect(tokens).toBe(0)
  })
})
