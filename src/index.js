const { encode } = require('gpt-3-encoder')
const getModel = require('./models')

const getTokens = (content='') => encode(content).length
const getTruncationLimit = (limit) => parseInt(limit) === limit ? limit : getModel(limit).tokens

const truncateMessage = (content, limit) => {
  const forceLimit = getTruncationLimit(limit)

  let total = 0
  let pointer
  do {
    // most pointer to up to next space
    pointer = pointer === undefined ? content.length : content.slice(0, pointer).lastIndexOf(' ')
    
    // impossible
    if (pointer === -1) {
      return ''
    }

    // check new token length
    total = getTokens(content.slice(0, pointer))
  } while (total > forceLimit)

  return content.slice(0, pointer)
}

// @TODO - Coming soon?
const truncateWrapper = (body={}, limit) => {
  // const forceLimit = getTruncationLimit(limit)

  // const newMessages = 
  return body
}

const verboseWrapper = (body={}) => {
  const model = getModel(body.model)

  const tokenTotal = body.messages.reduce((total, m) => total + getTokens(m.content), 0)
  const tokenLimit = model.tokens

  return {
    tokenLimit,
    tokenTotal,
    valid: tokenTotal < tokenLimit,
    cost: model.price * tokenTotal
  }
}

module.exports = {
  verboseWrapper,
  truncateWrapper,
  truncateMessage
}
