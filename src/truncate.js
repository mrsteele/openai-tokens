const { getLimit, getTokens } = require('./utils')

const truncateMessage = (content, limit) => {
  const forceLimit = getLimit(limit)

  let total = 0
  let pointer
  do {
    // most pointer to up to next space
    pointer = pointer === undefined ? content.length : content.slice(0, pointer).lastIndexOf(' ')

    // impossible
    if (pointer === -1) {
      return ''
    }

    // check new token length
    total = getTokens(content.slice(0, pointer))
  } while (total > forceLimit)

  return content.slice(0, pointer)
}

// @TODO - Coming soon?
const truncateWrapper = (body = {}, limit) => {
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

module.exports = {
  truncateMessage,
  truncateWrapper
}
