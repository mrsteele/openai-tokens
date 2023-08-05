const { truncateWrapper } = require('.')

describe('Index', () => {
  test('truncateWrapper (completions) - opts are not forwarded', () => {
    const response = truncateWrapper({
      model: 'gpt-3.5-turbo',
      opts: {
        limit: 1000
      },
      messages: [{
        role: 'user',
        content: 'hi'
      }]
    })

    expect(response.opts).toBeUndefined()
    expect(response.model).toBe('gpt-3.5-turbo')
    expect(response.messages.length).toBe(1)
  })

  test('truncateWrapper(embeddings) - opts are not forwarded', () => {
    const response = truncateWrapper({
      model: 'text-embedding-ada-002',
      opts: {
        limit: 1000
      },
      messages: [{
        role: 'user',
        content: 'hi'
      }]
    })

    expect(response.opts).toBeUndefined()
    expect(response.model).toBe('text-embedding-ada-002')
    expect(response.messages.length).toBe(1)
  })
})