const getModel = require('./models')
const encoder = require('./encoder')

const getTokens = (content = '', model) => encoder(content, model).length
const getLimit = (limit) => parseInt(limit) === limit ? limit : getModel(limit).tokens
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
  getAllTokens,
  getLimit
}
