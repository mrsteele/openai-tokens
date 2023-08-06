const { getEncoding } = require('js-tiktoken')

const gpt2 = getEncoding('gpt2')
const p50kBase = getEncoding('p50k_base')
const p50kEdit = getEncoding('p50k_edit')
const r50kBase = getEncoding('r50k_base')
const cl100kBase = getEncoding('cl100k_base')

// encodes: https://github.com/dqbd/tiktoken/blob/main/js/src/core.ts
const getEncodingNameForModel = (model) => {
  switch (model) {
    case 'gpt2': {
      return gpt2
    }
    case 'code-cushman-001':
    case 'code-cushman-002':
    case 'code-davinci-001':
    case 'code-davinci-002':
    case 'cushman-codex':
    case 'davinci-codex':
    case 'text-davinci-002':
    case 'text-davinci-003': {
      return p50kBase
    }
    case 'code-davinci-edit-001':
    case 'text-davinci-edit-001': {
      return p50kEdit
    }
    case 'ada':
    case 'babbage':
    case 'code-search-ada-code-001':
    case 'code-search-babbage-code-001':
    case 'curie':
    case 'davinci':
    case 'text-ada-001':
    case 'text-babbage-001':
    case 'text-curie-001':
    case 'text-davinci-001':
    case 'text-search-ada-doc-001':
    case 'text-search-babbage-doc-001':
    case 'text-search-curie-doc-001':
    case 'text-search-davinci-doc-001':
    case 'text-similarity-ada-001':
    case 'text-similarity-babbage-001':
    case 'text-similarity-curie-001':
    case 'text-similarity-davinci-001': {
      return r50kBase
    }
    case 'gpt-3.5-turbo-16k-0613':
    case 'gpt-3.5-turbo-16k':
    case 'gpt-3.5-turbo-0613':
    case 'gpt-3.5-turbo-0301':
    case 'gpt-3.5-turbo':
    case 'gpt-4-32k-0613':
    case 'gpt-4-32k-0314':
    case 'gpt-4-32k':
    case 'gpt-4-0613':
    case 'gpt-4-0314':
    case 'gpt-4':
    case 'text-embedding-ada-002':
    default: {
      return cl100kBase
    }
  }
}

const encoder = (text, model) => {
  const enc = getEncodingNameForModel(model)
  return enc.encode(text)
}

module.exports = encoder
