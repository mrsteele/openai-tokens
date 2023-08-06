const getModel = require('./models')
const { encode } = require('./encoder')

const getTokens = (content = '', model) => encode(content, model).length
const getModelLimit = (model = '') => getModel(model).tokens
const getBodyLimit = (body = {}) => {
  const limit = body.opts?.limit || getModelLimit(body.model)
  return limit - (body.opts?.buffer || 0)
}
const getAllTokens = (body = {}) => {
  if ('input' in body) {
    return Array.isArray(body.input) ? body.input.reduce((total, current) => total + getTokens(current, body.model), 0) : getTokens(body.input, body.model)
  }
  return body.messages.reduce((total, current, idx) => {
    return total + getTokens(current.content, body.model)
  }, 0)
}

module.exports = {
  getTokens,
  getBodyLimit,
  getAllTokens,
  getModelLimit
}
