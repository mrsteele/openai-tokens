const { validateWrapper } = require('./validate')

const dynamicWrapper = (originalBody = {}) => {
  const model = originalBody.model.find(a => validateWrapper({ ...originalBody, model: a }).valid)

  if (!model) {
    console.warn('openai-tokens[dynamic]: No valid model available. Either add larger models, adjust options, wrap it with the `truncateWrapper` or reduce prompt sizes.')
  }

  const { opts, ...body } = originalBody
  const results = {
    ...body,
    model: model || model[body.model.length - 1]
  }

  return opts?.stringify ? JSON.stringify(results) : results
}

module.exports.dynamicWrapper = dynamicWrapper
