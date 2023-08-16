// IDEA:
/*
const { createClient } = require('openai-tokens')
const client = createClient({
  json: true,
  buffer: 1000,
  key: 'kf-123',
  truncate: true,
  gptModels: ['gpt-3.5-turbo', 'gpt-3.5-turbo-4k'],
  embeddingModels: ['ada-embeddings']
})

// EMBEDDINGS
// one embedding
const e1 = await client.embed('Data goes here')

// mutli-embeddings
const e2 = await client.embed(['data', 'goes', here'])

// configurable embeddings
const e3 = await client.embed({
  input: ['data', 'here'],
  temperature: 0.2
})

// GPT
// single message
const gpt1 = await client.gpt('Tell me a joke!')

// multi-message
const gpt2 = await client.gpt([{
  role: 'system',
  content: 'You are a bot'
}, {
  role: 'user',
  content: 'What is your name?!'
}])

// configurable
const gpt2 = await client.gpt({
  temperature: 0.2,
  messages: [{
    role: 'system',
    content: 'You are a bot'
  }, {
    role: 'user',
    content: 'What is your name?!'
  }]
})
*/
require('isomorphic-fetch')
const { dynamicWrapper } = require('./dynamic')
const { truncateWrapper } = require('./truncate')

const argsToObject = (content, isGpt) => {
  const opts = {}
  if (Array.isArray(content)) {
    return isGpt ? { messages: content, opts } : { input: content, opts }
  } else if (content.toString() === content) {
    return isGpt
      ? {
          opts,
          messages: [{
            role: 'user',
            content
          }]
        }
      : { opts, input: [content] }
  } else {
    return { opts, ...content }
  }
}

const getDynamicOpts = (clientOpts, argsOpts) => {
  const opts = {}
  if (argsOpts.buffer) {
    opts.buffer = argsOpts.buffer
  } else if (clientOpts.buffer) {
    opts.buffer = clientOpts.buffer
  }

  return opts
}

const getTruncateOpts = (clientOpts, argsOpts) => {
  // always stringify
  const opts = { stringify: true }
  const keys = ['limit', 'buffer']

  for (const key of keys) {
    if (argsOpts[key]) {
      opts[key] = argsOpts[key]
    } else if (clientOpts[key]) {
      opts[key] = clientOpts[key]
    }
  }
  return opts
}

const defaultConfig = {
  json: true, // always respond with JSON
  truncate: true,
  buffer: null, // global buffer
  limit: null,
  key: null, // global key
  gptModels: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
  embeddingModels: ['text-embedding-ada-002']
}

const createClient = (config = {}) => {
  const opts = {
    ...defaultConfig,
    ...config
  }

  const createWrapper = async (isGpt, models = [], args) => {
    const obj = argsToObject(args, isGpt)
    const body = dynamicWrapper({
      model: models,
      ...obj,
      opts: getDynamicOpts(opts, obj.opts)
    })

    const response = await fetch(`https://api.openai.com/v1${isGpt ? '/chat/completions' : '/embeddings'}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${opts.key}`,
        'Content-Type': 'application/json'
      },
      body: opts.truncate
        ? truncateWrapper({
          ...body,
          opts: getTruncateOpts(opts, obj.opts)
        })
        : JSON.stringify(body)
    })

    return opts.json ? response.json() : response
  }

  const embed = async (args = {}) => {
    const response = await createWrapper(false, opts.embeddingModels, args)
    return response
  }

  const gpt = async (args = {}) => {
    const response = await createWrapper(true, opts.gptModels, args)
    return response
  }

  return { embed, gpt }
}

module.exports = createClient
