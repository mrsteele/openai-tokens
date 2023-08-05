const { encode } = require('gpt-3-encoder')
const getModel = require('./models')

const getTokens = (content = '') => encode(content).length
const getAllTokens = (body = {}) => {
  if (body.input) {
    return Array.isArray(body.input) ? body.input.reduce((total, current) => total + getTokens(current), 0) : getTokens(body.input)
  }
  return body.messages.reduce((total, current) => total + getTokens(current.content), 0)
}
const getLimit = (limit) => parseInt(limit) === limit ? limit : getModel(limit).tokens

module.exports = {
  getTokens,
  getAllTokens,
  getLimit
}
