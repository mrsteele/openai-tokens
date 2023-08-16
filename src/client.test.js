const { createClient } = require('.')

const defaultResponse = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer null',
    'Content-Type': 'application/json'
  }
}

describe('createClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, opts) => Promise.resolve({
      nonJson: true,
      url,
      opts,
      json: () => Promise.resolve({ url, opts })
    }))
  })

  test('should default to proper options', async () => {
    const client = createClient()

    const gpt = await client.gpt('test')
    //     expect(console.warn.mock.calls[0][0]).toMatch(/nonexistent/)
    expect(gpt.url).toBe('https://api.openai.com/v1/chat/completions')
    expect(gpt.opts).toMatchObject({
      ...defaultResponse,
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: 'test'
        }]
      })
    })

    const embed = await client.embed('test')
    expect(embed.url).toBe('https://api.openai.com/v1/embeddings')
    expect(embed.opts).toMatchObject({
      ...defaultResponse,
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: ['test']
      })
    })
  })

  test('should support key config', async () => {
    const key = 'openai-abc-123'
    const client = createClient({ key })

    const gpt = await client.gpt('test')
    expect(gpt.opts.headers.Authorization).toBe(`Bearer ${key}`)

    const embed = await client.gpt('test')
    expect(embed.opts.headers.Authorization).toBe(`Bearer ${key}`)
  })

  describe('models', () => {
    test('should default gpt models to 3.5 and 16k', async () => {
      const defaultClient = createClient()
      const gpt = await defaultClient.gpt('test')
      expect(JSON.parse(gpt.opts.body).model).toBe('gpt-3.5-turbo')
      const gpt2 = await defaultClient.gpt('one two three four five six seven eight nine ten '.repeat(450))
      expect(JSON.parse(gpt2.opts.body).model).toBe('gpt-3.5-turbo-16k')
    })

    test('should default embeddings to just ada (nothing bigger yet...)', async () => {
      const defaultClient = createClient()
      const e = await defaultClient.embed('test')
      expect(JSON.parse(e.opts.body).model).toBe('text-embedding-ada-002')
    })

    test('should support overriding gpt models', async () => {
      const defaultClient = createClient({
        gptModels: ['gpt-3.5-turbo-0613', 'gpt-3.5-turbo-16k-0613']
      })
      const gpt = await defaultClient.gpt('test')
      expect(JSON.parse(gpt.opts.body).model).toBe('gpt-3.5-turbo-0613')
      const gpt2 = await defaultClient.gpt('one two three four five six seven eight nine ten '.repeat(450))
      expect(JSON.parse(gpt2.opts.body).model).toBe('gpt-3.5-turbo-16k-0613')
    })
  })

  test('should default to json on configuration', async () => {
    // defaults to json
    const client1 = createClient()
    const gpt = await client1.gpt('test')
    expect(gpt.nonJson).toBeFalsy()
    const embed = await client1.embed('test')
    expect(embed.nonJson).toBeFalsy()

    const client2 = createClient({ json: false })
    const gpt2 = await client2.gpt('test')
    expect(gpt2.nonJson).toBe(true)
    const embed2 = await client2.embed('test')
    expect(embed2.nonJson).toBe(true)
  })

  describe('limit', () => {
    test('should support client-level limits', async () => {
      const client1 = createClient({ limit: 5 })
      const gpt = await client1.embed('this is larger than five tokens')
      expect(JSON.parse(gpt.opts.body).input[0]).toBe('this is larger than five')
    })

    test('should support lower-level limits', async () => {
      const client1 = createClient({ limit: 5 })
      const gpt2 = await client1.embed({ input: 'this is larger than five tokens', opts: { limit: 2 } })
      expect(JSON.parse(gpt2.opts.body).input).toBe('this is')
    })
  })

  describe('buffer', () => {
    test('should support client-level buffer', async () => {
      const client1 = createClient({ buffer: 8192 - 1 - 5 }) // 5 leftover (offset 1)
      const gpt = await client1.embed('this is larger than five tokens')
      expect(JSON.parse(gpt.opts.body).input[0]).toBe('this is larger than five')
    })

    test('should support lower-level buffer', async () => {
      const client1 = createClient({ buffer: 8192 - 1 - 5 })
      const gpt2 = await client1.embed({ input: 'this is larger than five tokens', opts: { buffer: 8192 - 1 - 2 } })
      expect(JSON.parse(gpt2.opts.body).input).toBe('this is')
    })
  })

  describe('truncate', () => {
    test('should default to true', async () => {
      const defaultClient = createClient({ limit: 5 })
      const e = await defaultClient.embed('this is more than five tokens')
      expect(JSON.parse(e.opts.body).input[0]).toBe('this is more than five')
    })

    test('should support configuring as "false"', async () => {
      const defaultClient = createClient({ limit: 5, truncate: false })
      const e = await defaultClient.embed('this is more than five tokens')
      expect(JSON.parse(e.opts.body).input[0]).toBe('this is more than five tokens')
    })
  })
})
