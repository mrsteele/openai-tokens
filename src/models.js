const { modelCatalog, patternCatalog, aliasCatalog } = require('./model-data')

const defaultModel = 'gpt-3.5-turbo'

const normalizeModel = (model = '') => {
  const value = String(model || '').trim()
  if (!value) {
    return value
  }

  const alias = aliasCatalog[value]
  return alias || value
}

const resolveModel = (model = '') => {
  const normalized = normalizeModel(model)
  const exact = modelCatalog[normalized]
  if (exact) {
    return exact
  }

  for (const [pattern, config] of patternCatalog) {
    if (pattern.test(normalized)) {
      return config
    }
  }

  return null
}

const getModel = (model = '') => {
  const lookup = resolveModel(model)
  if (!lookup) {
    console.warn(`openai-tokens: The model "${model}" is not currently supported. Defaulting to "${defaultModel}"`)
    return modelCatalog[defaultModel]
  }

  return lookup
}

const listSupportedModels = () => Object.keys(modelCatalog)

const registerModel = (model, info = {}) => {
  const name = String(model || '').trim()
  if (!name) {
    throw new Error('openai-tokens: `model` is required when registering a model.')
  }

  const tokens = Number(info.tokens)
  const price = Number(info.price)

  if (!Number.isFinite(tokens) || tokens <= 0) {
    throw new Error('openai-tokens: `tokens` must be a positive number when registering a model.')
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('openai-tokens: `price` must be a non-negative number when registering a model.')
  }

  modelCatalog[name] = { tokens, price }
  return modelCatalog[name]
}

const registerModels = (entries = {}) => {
  for (const [model, info] of Object.entries(entries)) {
    registerModel(model, info)
  }

  return listSupportedModels()
}

module.exports = getModel
module.exports.getModel = getModel
module.exports.resolveModel = resolveModel
module.exports.listSupportedModels = listSupportedModels
module.exports.registerModel = registerModel
module.exports.registerModels = registerModels
module.exports.defaultModel = defaultModel
