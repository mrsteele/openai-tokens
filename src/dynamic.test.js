const { dynamicWrapper } = require('.')
const ten = 'this is 10 tokens long for reference? '

const defaultRequest = {
  model: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k']
}

describe('dynamicWrapper', () => {
  test('picks the first one when valid', () => {
    const result = dynamicWrapper({
      ...defaultRequest,
      messages: [{
        role: 'user',
        content: 'This makes works fine'
      }]
    })

    expect(result.model).toBe(defaultRequest.model[0])
  })

  test('picks the larger when exceeding the first one', () => {
    const result = dynamicWrapper({
      ...defaultRequest,
      messages: [{
        role: 'user',
        content: ten.repeat(500)
      }]
    })

    expect(result.model).toBe(defaultRequest.model[1])
  })

  test('picks the "best" when you exceed everything (lower)', () => {
    const result = dynamicWrapper({
      ...defaultRequest,
      limit: 2,
      opts: {
        limit: 7000
      },
      messages: [{
        role: 'user',
        content: ten.repeat(500)
      }]
    })

    expect(result.model).toBe(defaultRequest.model[0])
  })

  test('picks the "best" when you exceed everything (higher)', () => {
    const result2 = dynamicWrapper({
      ...defaultRequest,
      opts: {
        limit: 9000
      },
      test: true,
      messages: [{
        role: 'user',
        content: ten.repeat(1000)
      }]
    })

    expect(result2.model).toBe(defaultRequest.model[1])
  })

  test('should still stringify if we must', () => {
    const args = {
      ...defaultRequest,
      messages: [{
        role: 'user',
        content: 'This makes works fine'
      }],
      opts: {
        stringify: true,
        buffer: 1000
      }
    }
    const result = dynamicWrapper(args)

    const { opts, model, ...body } = args
    expect(result.length).toBe(JSON.stringify({ ...body, model: defaultRequest.model[0] }).length)
  })
})
