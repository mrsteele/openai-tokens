const { getTokens } = require('./utils')
const getModel = require('./models')

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

module.exports = verboseWrapper
