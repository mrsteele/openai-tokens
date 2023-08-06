const { validateMessage, validateWrapper } = require('./validate')
const bigStr = 'so not even Matt can explore it'.repeat(1000)

describe('validateMessage', () => {
  test('should support number limits', () => {
    expect(validateMessage('Test', 0)).toBe(false)
    expect(validateMessage('Test', 1)).toBe(true)
    expect(validateMessage('Test two', 1)).toBe(false)
  })

  test('should support model names', () => {
    expect(validateMessage('Test', 'gpt-3.5-turbo')).toBe(true)
    expect(validateMessage(bigStr, 'gpt-3.5-turbo')).toBe(false)
  })

  test('should default to gpt-3.5-turbo and share a warning', () => {
    console.warn = jest.fn()

    expect(validateMessage('Test', 'missing 1')).toBe(true)
    expect(validateMessage(bigStr, 'missing 2')).toBe(false)
    expect(console.warn.mock.calls[0][0]).toMatch(/missing 1/)
    expect(console.warn.mock.calls[1][0]).toMatch(/missing 2/)
  })
})

describe('validateWrapper', () => {
  test('should provide basic information about prompt', () => {
    const results = validateWrapper({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'you are weak'
      }, {
        role: 'user',
        content: 'Lift this heavy thing!'
      }]
    })

    expect(results).toMatchObject({
      tokenLimit: 4096,
      tokenTotal: 9,
      cost: 0.0000135,
      valid: true
    })
  })

  test('should show valid=false when invalid', () => {
    const results = validateWrapper({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'you are weak'
      }, {
        role: 'user',
        content: bigStr
      }]
    })

    expect(results).toMatchObject({
      tokenLimit: 4096,
      tokenTotal: 7003,
      cost: 0.0105045,
      valid: false
    })
  })

  test('should support embeddings (single input)', () => {
    const results = validateWrapper({
      model: 'text-embedding-ada-002',
      input: 'single input embedding'
    })

    expect(results).toMatchObject({
      tokenLimit: 8191,
      tokenTotal: 4,
      cost: 0.0000004,
      valid: true
    })
  })

  test('should support embeddings (multi input)', () => {
    const results = validateWrapper({
      model: 'text-embedding-ada-002',
      input: ['single input embedding', 'surprise secondary input']
    })

    expect(results).toMatchObject({
      tokenLimit: 8191,
      tokenTotal: 8,
      cost: 0.0000008,
      valid: true
    })
  })

  test('bottom edge case', () => {
    const results = validateWrapper({
      model: 'text-embedding-ada-002',
      // 4096
      input: ''
    })

    expect(results.valid).toBe(true)
  })

  test('top edge case', () => {
    const valid = 'this is 10 tokens long for reference okay? '.repeat(910)
    const results = validateWrapper({
      model: 'text-embedding-ada-002',
      // 8191
      input: valid
    })

    console.log('results', results)

    expect(results.valid).toBe(true)

    const results2 = validateWrapper({
      model: 'text-embedding-ada-002',
      // 8192
      input: valid + 'newer2'
    })

    expect(results2.valid).toBe(false)
  })
})
