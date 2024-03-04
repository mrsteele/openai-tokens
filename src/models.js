// sources
// https://platform.openai.com/docs/deprecations/
// https://openai.com/pricing
// https://platform.openai.com/docs/models/continuous-model-upgrades

// tokens
const _4k = 4096
const _8k = 8192
const _16k = 16384
const _32k = 32768

const models = {
  // gpt 4
  'gpt-4': {
    tokens: _8k,
    price: 0.00003
  },
  'gpt-4-0613': {
    tokens: _8k,
    price: 0.00003
  },
  'gpt-4-32k': {
    tokens: _32k,
    price: 0.00006
  },
  'gpt-4-32k-0613': {
    tokens: _32k,
    price: 0.00006
  },

  // gpt 3
  'gpt-3.5-turbo': {
    tokens: _4k,
    price: 0.0000015
  },
  'gpt-3.5-turbo-16k': {
    tokens: _16k,
    price: 0.000003
  },
  'gpt-3.5-turbo-0613': {
    tokens: _4k,
    price: 0.0000015
  },
  'gpt-3.5-turbo-16k-0613': {
    tokens: _16k,
    price: 0.000003
  },
  'gpt-3.5-turbo-0125': {
    tokens: _16k,
    price: .0000005
  },
  'gpt-3.5-turbo-instruct': {
    tokens: _4k,
    price: .0000015 // input only... output is $2 / 1m

  // embeddings
  'text-embedding-ada-002': {
    tokens: _8k - 1, // offset
    price: .0000001
  },
  'text-embedding-3-small': {
    tokens: _8k - 1, // offset
    price: 0.00000002
  },
  'text-embedding-3-large': {
    tokens: _8k - 1, // offset
    price: 0.00000013
  },

  // legacy
  'text-davinci-003': {
    tokens: _4k + 1, // offset
    price: 0.00002
  },
  'text-davinci-002': {
    tokens: _4k + 1, // offset
    price: 0.00002
  },
  'code-davinci-002': {
    tokens: 8001, // offset
    price: 0 // free for researches? https://platform.openai.com/docs/deprecations/
  }
}

const defaultModel = 'gpt-3.5-turbo'
const getModel = (model = '') => {
  const lookup = models[model]
  if (!lookup) {
    console.warn(`openai-tokens: The model "${model}" is not currently supported. Defaulting to "${defaultModel}"`)
    return models[defaultModel]
  }

  return lookup
}

module.exports = getModel
