const { truncateWrapper } = require('./truncate')

const bigStr = 'so not even Matt can explore it '.repeat(650)
const str = 'so not even Matt can explore it '.repeat(585) + 'so'
// target (18722)
// 588 =18816
// 589 = 18848
// 590 = 18880

describe('truncateWrapper', () => {
  test('should truncate embeddings (singular)', () => {
    const response = truncateWrapper({
      model: 'text-embedding-ada-002',
      input: bigStr
    })

    expect(response.input).toBe(str)
  })

  test('should truncate embeddings (multiple)', () => {
    const response = truncateWrapper({
      model: 'text-embedding-ada-002',
      input: [bigStr, bigStr, 'small embedding']
    })

    expect(response.input).toMatchObject([str, str, 'small embedding'])
  })

  test('should support supplied limits', () => {
    const response = truncateWrapper({
      model: 'text-embedding-ada-002',
      opts: {
        limit: 2
      },
      input: [bigStr, bigStr, 'small embedding']
    })

    expect(response.input).toMatchObject(['so not', 'so not', 'small embed'])
  })
})
