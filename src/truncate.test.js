const { truncateWrapper } = require('./truncate')

const ten = 'this is 10 tokens long for reference okay? '
const bigStr = 'so not even Matt can explore it '.repeat(1200)
const str = 'so not even Matt can explore it '.repeat(1170) + 'hi'
// target (18722)
// 588 =18816
// 589 = 18848
// 590 = 18880

const compareArrays = (arr1, arr2) => {
  expect(arr1.map(a => a.length)).toMatchObject(arr2.map(a => a.length))
}

describe('truncateWrapper', () => {
  test('should truncate embeddings (singular)', () => {
    const response = truncateWrapper({
      model: 'text-embedding-ada-002',
      input: bigStr
    })

    expect(response.input.length).toBe(str.length)
  })

  test('should truncate embeddings (multiple)', () => {
    const response = truncateWrapper({
      model: 'text-embedding-ada-002',
      input: [bigStr, bigStr, 'small embedding']
    })
    compareArrays(response.input, [str, str, 'small embedding'])
  })

  test('should support supplied limits', () => {
    const response = truncateWrapper({
      model: 'text-embedding-ada-002',
      opts: {
        limit: 2
      },
      input: [bigStr, bigStr, 'small embedding']
    })

    compareArrays(response.input, ['so not', 'so not', 'small embed'])
  })

  test('should truncate in pairs when they are too big', () => {
    const response = truncateWrapper({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'This should always be there!'
      }, {
        role: 'user',
        content: bigStr
      }, {
        role: 'assistant',
        content: 'Just a small string (does not matter, because we remove in pairs)'
      }, {
        role: 'user',
        content: 'Final user prompt'
      }]
    })

    expect(response.messages).toMatchObject([{
      role: 'system',
      content: 'This should always be there!'
    }, {
      role: 'user',
      content: 'Final user prompt'
    }])
  })

  test('should support buffers', () => {
    const response = truncateWrapper({
      model: 'gpt-3.5-turbo',
      opts: {
        buffer: 1000
      },
      messages: [
        ...Array(500).fill({
          role: 'user',
          content: ten
        }),
        ...Array(500).fill({
          role: 'assistant',
          content: ten
        })
      ]
    })

    expect(response.messages.length).toBe(308)
  })
})
