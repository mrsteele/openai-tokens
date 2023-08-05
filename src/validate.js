const { getAllTokens, getLimit, getTokens } = require('./utils')
const getModel = require('./models')

const validateWrapper = (body = {}) => {
  const model = getModel(body.model)

  const tokenTotal = getAllTokens(body)
  const tokenLimit = model.tokens

  return {
    tokenLimit,
    tokenTotal,
    valid: tokenTotal <= tokenLimit,
    cost: model.price * tokenTotal
  }
}

const validateMessage = (content = '', limit) => {
  const forceLimit = getLimit(limit)
  const tokens = getTokens(content)
  return tokens <= forceLimit
}

module.exports = {
  validateWrapper,
  validateMessage
}
