const _8k = 8192
const _16k = 16384
const _32k = 32768
const _128k = 128000
const _200k = 200000

// Prices are input token prices in USD per token.
// Source: https://openai.com/api/pricing (queried March 7, 2026)
const modelCatalog = {
  // GPT-5 family
  'gpt-5': { tokens: _200k, price: 0.00000125 },
  'gpt-5-chat-latest': { tokens: _200k, price: 0.00000125 },
  'gpt-5-mini': { tokens: _200k, price: 0.00000025 },
  'gpt-5-nano': { tokens: _200k, price: 0.00000005 },

  // GPT-4.1 family
  'gpt-4.1': { tokens: _128k, price: 0.000002 },
  'gpt-4.1-mini': { tokens: _128k, price: 0.0000004 },
  'gpt-4.1-nano': { tokens: _128k, price: 0.0000001 },

  // GPT-4o family
  'gpt-4o': { tokens: _128k, price: 0.0000025 },
  'gpt-4o-mini': { tokens: _128k, price: 0.00000015 },
  'chatgpt-4o-latest': { tokens: _128k, price: 0.000005 },

  // reasoning models
  o1: { tokens: _200k, price: 0.000015 },
  'o1-pro': { tokens: _200k, price: 0.00015 },
  o3: { tokens: _200k, price: 0.000002 },
  'o3-pro': { tokens: _200k, price: 0.00002 },
  'o4-mini': { tokens: _200k, price: 0.0000011 },

  // embeddings
  'text-embedding-3-small': { tokens: _8k - 1, price: 0.00000002 },
  'text-embedding-3-large': { tokens: _8k - 1, price: 0.00000013 },
  'text-embedding-ada-002': { tokens: _8k - 1, price: 0.0000001 },

  // legacy and pinned models
  'gpt-4-turbo': { tokens: _128k, price: 0.00001 },
  'gpt-4': { tokens: _8k, price: 0.00003 },
  'gpt-4-32k': { tokens: _32k, price: 0.00006 },
  'gpt-3.5-turbo': { tokens: 4096, price: 0.0000015 },
  'gpt-3.5-turbo-16k': { tokens: _16k, price: 0.000003 },
  'gpt-3.5-turbo-instruct': { tokens: 4096, price: 0.0000015 },
  'text-davinci-003': { tokens: 4097, price: 0.00002 },
  'text-davinci-002': { tokens: 4097, price: 0.00002 },
  'code-davinci-002': { tokens: 8001, price: 0 }
}

const patternCatalog = [
  [/^gpt-4\.1-mini(?:-|$)/, modelCatalog['gpt-4.1-mini']],
  [/^gpt-4\.1-nano(?:-|$)/, modelCatalog['gpt-4.1-nano']],
  [/^gpt-4\.1(?:-|$)/, modelCatalog['gpt-4.1']],
  [/^gpt-5-mini(?:-|$)/, modelCatalog['gpt-5-mini']],
  [/^gpt-5-nano(?:-|$)/, modelCatalog['gpt-5-nano']],
  [/^gpt-5(?:-|$)/, modelCatalog['gpt-5']],
  [/^gpt-4o-mini(?:-|$)/, modelCatalog['gpt-4o-mini']],
  [/^gpt-4o(?:-|$)/, modelCatalog['gpt-4o']],
  [/^chatgpt-4o-latest(?:-|$)/, modelCatalog['chatgpt-4o-latest']],
  [/^o1-pro(?:-|$)/, modelCatalog['o1-pro']],
  [/^o1(?:-|$)/, modelCatalog.o1],
  [/^o3-pro(?:-|$)/, modelCatalog['o3-pro']],
  [/^o3(?:-|$)/, modelCatalog.o3],
  [/^o4-mini(?:-|$)/, modelCatalog['o4-mini']],
  [/^text-embedding-3-small(?:-|$)/, modelCatalog['text-embedding-3-small']],
  [/^text-embedding-3-large(?:-|$)/, modelCatalog['text-embedding-3-large']],
  [/^text-embedding-ada-002(?:-|$)/, modelCatalog['text-embedding-ada-002']],
  [/^gpt-4-turbo(?:-|$)/, modelCatalog['gpt-4-turbo']],
  [/^gpt-4-32k(?:-|$)/, modelCatalog['gpt-4-32k']],
  [/^gpt-4(?:-|$)/, modelCatalog['gpt-4']],
  [/^gpt-3\.5-turbo-16k(?:-|$)/, modelCatalog['gpt-3.5-turbo-16k']],
  [/^gpt-3\.5-turbo(?:-|$)/, modelCatalog['gpt-3.5-turbo']]
]

const aliasCatalog = {
  o1pro: 'o1-pro',
  o3pro: 'o3-pro'
}

module.exports = {
  modelCatalog,
  patternCatalog,
  aliasCatalog
}
