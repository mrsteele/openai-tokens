const { getLimit, getTokens, getAllTokens } = require('./utils')
const { encode, decode } = require('gpt-3-encoder')

const truncateMessage = (content, limit) => {
  const forceLimit = getLimit(limit)

  const encoded = encode(content)
  const newEncoded = encoded.slice(0, forceLimit)
  return decode(newEncoded)
}

const truncateEmbedding = (body = {}, limit) => {
  const forceLimit = getLimit(limit || body.model)
  if (Array.isArray(body.input)) {
    const newInput = []
    for (let i = 0; i < body.input.length; i++) {
      newInput.push(truncateMessage(body.input[i], forceLimit))
    }
    return {
      ...body,
      input: newInput
    }
  } else {
    return {
      ...body,
      input: truncateMessage(body.input, forceLimit)
    }
  }
}

const truncateCompletion = (body = {}, limit) => {
  const forceLimit = getLimit(limit || body.model)

  // calculate all parts first...
  let runningTotal = 0
  const newMessages = body.messages.map(message => {
    const tokens = getTokens(message.content)
    runningTotal += tokens

    return {
      ...message,
      tokens,
      runningTotal
    }
  })

  // if its good, just send it off
  // console.log('forceLimit', getTokens(body.messages[0].content))
  // return forceLimit
  if (runningTotal <= forceLimit) {
    return body
  }

  const bigIndex = newMessages.findIndex(m => m.runningTotal > forceLimit)
  const newLimit = forceLimit - newMessages.slice(0, bigIndex).reduce((total, current) => total + current.tokens, 0)
  const { role, content } = body.messages[bigIndex]

  return ({
    ...body,
    messages: [
      ...body.messages.slice(0, bigIndex),
      {
        role,
        content: truncateMessage(content, newLimit)
      }
    ]
  })
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
const truncateWrapper = (originalBody = {}, limit) => {
  if (limit) {
    console.warn('Using the "limit" argument on "truncateWrapper" is deprecated. Please us the "opts" property on the main object instead. Read more at https://github.com/mrsteele/openai-tokens/wiki/%5BDeprecated%5D-No-longer-supporting-the-%22limit%22-argument-on-%22truncateWrapper%22')
  }
  const { opts, ...body } = originalBody
  const fn = !!body.input ? truncateEmbedding : truncateCompletion
  return fn(body, limit || opts?.limit)
}

const truncateContext = (body) => {
  const limit = getLimit(body.model)
  const allTokens = getAllTokens(body)
  const diff = allTokens - limit

  if (diff <= 0) {
    return body
  }

  /*
    system
    user
    assistant
    user
  */

  const lowerBounds = body.messages.lastIndexOf(a => a.role === 'system')
  const upperBounds = body.messages.lastIndexOf(a => a.role === 'assistant') + 1

  const assistantArr = body.messages.slice(lowerBounds, upperBounds)

}

module.exports = {
  truncateMessage,
  truncateWrapper
}
