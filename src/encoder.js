const { getEncoding, getEncodingNameForModel } = require('js-tiktoken')

const models = [
  'gpt2',
  'p50k_base',
  'p50k_edit',
  'r50k_base',
  'cl100k_base',
  'o200k_base'
].reduce((all, key) => {
  all[key] = getEncoding(key)
  return all
}, {})

// used to set the correct model
const getEncoder = (model) => {
  try {
    return models[getEncodingNameForModel(model)]
  } catch (err) {
    // default
    return models.cl100k_base
  }
}

const encode = (text, model) => {
  const enc = getEncoder(model)
  return enc.encode(text)
}

const decode = (array, model) => {
  const enc = getEncoder(model)
  return enc.decode(array)
}

module.exports.encode = encode
module.exports.decode = decode
