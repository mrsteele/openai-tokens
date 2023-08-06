const { getModelLimit, getBodyLimit, getAllTokens } = require('./utils')
const { encode, decode } = require('./encoder')

const truncateMessage = (content, model, limit) => {
  const modelLimit = getModelLimit(model)
  const actualLimit = limit ?? modelLimit

  const encoded = encode(content, model)
  const newEncoded = encoded.slice(0, actualLimit)
  return decode(newEncoded, model)
}

const truncateEmbedding = (originalBody = {}) => {
  const { opts, ...body } = originalBody
  const forceLimit = getBodyLimit(originalBody)
  if (Array.isArray(body.input)) {
    const newInput = []
    for (let i = 0; i < body.input.length; i++) {
      newInput.push(truncateMessage(body.input[i], body.model, forceLimit))
    }
    return {
      ...body,
      input: newInput
    }
  } else {
    return {
      ...body,
      input: truncateMessage(body.input, body.model, forceLimit)
    }
  }
}

// uses redundancy
const limitMessages = (messages, limit) => {
  const total = getAllTokens({ messages })
  if (total <= limit) {
    return messages
  }

  // remove in pair
  const slices = [
    messages.findIndex(m => m.role === 'user'),
    messages.findIndex(m => m.role === 'assistant')
  ].sort().reverse()

  // no "nothing" found, pair is removable
  if (slices.indexOf(-1) === -1) {
    for (const slice of slices) {
      messages.splice(slice, 1)
    }

    // try again
    return limitMessages(messages, limit)
  }

  console.warn('Unable to truncate any further. Prompts too large. Returning unresolvable.')
  return messages
}

const truncateCompletion = (originalBody = {}) => {
  const { opts, ...body } = originalBody
  const forceLimit = getBodyLimit(originalBody)

  const runningTotal = getAllTokens(body)

  // if its good, just send it off
  if (runningTotal <= forceLimit) {
    return body
  }

  // clone and limit
  return {
    ...body,
    messages: limitMessages(JSON.parse(JSON.stringify(body.messages)), forceLimit)
  }
}

/**
 * Used to truncate a request
 * @param {JSON} body - The entire body of the message
 * @param {String} body.model - The model to pass to OpenAI
 * @param {JSON} opts - (option) Additional options for truncation.
 * @param {Int} opts.limit - (optional) Overrides the model limit for stricter rules.
 * @param {JSON[]} body.messages - (optional) Used for completion messages.
 * @param {String|String[]} body.input - (optional) Used for embeddings.
 * @returns {JSON} The resulting object
 */
const truncateWrapper = (body = {}) => {
  const fn = body.input ? truncateEmbedding : truncateCompletion
  return fn(body)
}

module.exports = {
  truncateMessage,
  truncateWrapper
}
