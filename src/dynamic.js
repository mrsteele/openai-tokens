const getModel = require('./models')
const { validateWrapper } = require('./validate')

// this is only used if you pass a limit and need to find what "best" fits (knowing truncation is inevitable)
/*
- model: [gpt-3.5, gpt-4],
- limit: 2
- should choose the smaller one
*/
const findBackupModel = (originalBody = {}) => {
  const totalLimit = (originalBody.opts.limit || 0) + (originalBody.opts.buffer || 0)
  const firstTooBigIndex = originalBody.model.findIndex(a => getModel(a).tokens > totalLimit)
  // go back one
  return originalBody.model[firstTooBigIndex]
}

const dynamicWrapper = (originalBody = {}) => {
  let model = originalBody.model.find(a => validateWrapper({ ...originalBody, model: a }).valid)

  if (!model && originalBody.opts && (originalBody.opts.limit || originalBody.opts.buffer)) {
    const backupModel = findBackupModel(originalBody)
    if (backupModel) {
      model = backupModel
    }
  }

  // still?
  if (!model) {
    console.warn('openai-tokens[dynamic]: No valid model available. Either add larger models, adjust options, wrap it with the `truncateWrapper` or reduce prompt sizes.')
    model = originalBody.model[originalBody.model.length - 1]
  }

  const { opts, ...body } = originalBody
  const results = {
    ...body,
    model
  }

  return opts?.stringify ? JSON.stringify(results) : results
}

module.exports.dynamicWrapper = dynamicWrapper
