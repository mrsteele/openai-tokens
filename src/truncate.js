const { getLimit, getTokens } = require('./utils')
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
  if (runningTotal < forceLimit) {
    return body
  }

  // ...otherwise
  // find last culprit, everything else will be removed...
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

const truncateWrapper = (body = {}, limit) => {
  const isEmbedding = !!body.input
  if (isEmbedding) {
    return truncateEmbedding(body, limit)
  } else {
    return truncateCompletion(body, limit)
  }
}

module.exports = {
  truncateMessage,
  truncateWrapper
}
