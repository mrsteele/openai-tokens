const { encode } = require('gpt-3-encoder')
const getModel = require('./models')

const getTokens = (content='') => encode(content).length
const getTruncationLimit = (limit) => parseInt(limit) === limit ? limit : getModel(limit).tokens

module.exports = {
  getTokens,
  getTruncationLimit
}
