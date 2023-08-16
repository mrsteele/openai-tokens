const { getAllTokens, getModelLimit, getTokens, getBodyLimit } = require('./utils')
const getModel = require('./models')

const validateWrapper = (body = {}) => {
  const model = getModel(body.model)

  const tokenTotal = getAllTokens(body)
  const tokenLimit = getBodyLimit(body)

  return {
    tokenLimit,
    tokenTotal,
    valid: tokenTotal <= tokenLimit,
    cost: model.price * tokenTotal
  }
}

const validateMessage = (content = '', model) => {
  const forceLimit = getModelLimit(model)
  const tokens = getTokens(content, model)
  return tokens <= forceLimit
}

module.exports = {
  validateWrapper,
  validateMessage
}
