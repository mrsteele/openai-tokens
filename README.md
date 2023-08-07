# openai-tokens
Accurate token calcuations for OpenAI GPT prompts and embeddings.

[![codecov](https://codecov.io/gh/mrsteele/openai-tokens/branch/main/graph/badge.svg?token=NCG32SMS6Z)](https://codecov.io/gh/mrsteele/openai-tokens)

## Features

This package was written by an author who actively uses OpenAI and was running into some limitations. This package helps to get you setup.

- 🏃 **FAST** - If you need to run a calculation or truncation quickly, this is the module for you!
- 🎯 **Accurate** - This module is arguably the MOST accurate utility, using js-tiktoken which matches exact models.
- 😌 **Seamless** - Integration should be simple. Wrappers make this accessible.
- 🔒 **Secure** - Your data is yours, this library just wants to help.

## Installation

```
npm i openai-tokens
```

## Use-Cases

### Maintain Chat History

This module will do the math for you. Pass as many messages into your prompt and we will filter out what doesn't fit over time before sending to OpenAI.

```js
// keep as much history as possible
await fetch('https://api.openai.com/v1/completions', {
  body: JSON.stringify(truncateWrapper({
    model: 'gpt-3.5-turbo',
    opts: {
      buffer: 500 // give a buffer so GPT can respond (limit - buffer)!
    },
    messages: [{
      role: 'system',
      content: 'System messages are always protected from truncation!'
    }, {
      role: 'user', // This will be removed (too big), along with a paired assistant message
      content: bigStr
    }, {
      role: 'assistant', // the pair that is removed
      content: 'Just a small string (does not matter, because we remove in pairs)'
    }, {
      role: 'user',
      content: 'Final user prompt'
    }]
  }))
})
```

### Limit embeddings

Embeddings support a lot of data, and sometimes more data than you have room for. Put all your important information in the input, and this module will truncate was doesn't fit.

```js
// protect your requests from going over:
await fetch('https://api.openai.com/v1/embeddings', {
  method: 'POST',
  body: JSON.stringify(truncateWrapper({
    mode: 'text-embedding-ada-002',
    inputs: ['large data set, pretend this goes on for most of eternity...']
  }))
})
```

## Complete Usage

### Truncate

You can use the truncate tools to enforce cutoffs of sentences that are too large. This can be automatically detected or you can provide your own limits. The truncation is programmed to break on a word, not in the middle.

```js

import {
  truncateMessage, // truncate a single message
  truncateWrapper, // truncate all messages
} from 'openai-tokens'

// The input (strings, just like prompts!)
const str = 'Trying to save money on my prompts! 💰'

// truncate with a model and we detect the algorithm and token limit
const truncatedByModel = truncateMessage(str, 'gpt-3.5-turbo')
// Optionally you can add a number. Below is an example to limit to 1000
const truncatedByByNumber = truncateMessage(str, 'gpt-3.5-turbo', 1000)

// enforce truncation around all messages
const truncatedBody = truncateWrapper({
  model: 'gpt-4', // auto-detects token limits 🙌
  // optionally, you can supply your own limit (surpressed in output)
  opts: {
    limit: 1000
  },
  messages: [
    { role: 'system', content: 'this will never truncate' },
    { role: 'user', content: str },
    { role: 'assistant', content: 'Removes in pairs, so this and the prior "user" message will be removed' },
    { role: 'user', content: 'This will be preserved, because there is no matching "assistant" message.' }
  ]
})
```

### Validate

The validation tools are used if you need to get information about the prompt costs or token amount.

```js
import {
  validateMessage, // validate a single message
  validateWrapper // validate all messages
} from 'openai-tokens'

// The input (strings, just like prompts!)
const str = 'Trying to save money on my prompts! 💰'

// validate that a message has a limit
const isValid = validateMessage(str, 'gpt-3.5-turbo')
if (isValid) {
  // actually send the prompt 😊
}

// Validate the entire body
const promptInfo = validateWrapper({
  model: '[Title](src/models.js)', // we validate embeddings for you 👍
  messages: [{ role: 'user', content: str }]
})

if (promptInfo.valid) {
  // actually send the prompt 😊
}

// HINT: the `validateWrapper` also provides a lot of other helpful information
console.log(promptInfo)
/* output:
{
  tokenLimit: 4096,
  tokenTotal: 8,
  valid: true,
  cost: 0.00024
}
*/

```

## Additional Information

### Token Limits

This service will support maximum response sizes. So if you want to leave room to respond, make sure you leave room to respond.

From ChatGPT directly:

> Remember that very long conversations are more likely to receive incomplete replies. For example, if a conversation is 4090 tokens long, the reply will be cut off after only 6 tokens.

### Accuracy

In working on this module, accuracy was a challenge due to the fact that each model uses its own way to calculate token consuption. Because of that, **we changed this module to exclusively accept model names instead of numbers**. See [this ticket](https://github.com/mrsteele/openai-tokens/issues/7) which opened up this problem.

### Undetected Models

If you provide a model that is not supported, you will get a console message as well as defaulted to `gpt-3.5-turbo`.

### Supported Models

The following models are supported. Plenty more available upon request (in fact, feel free to submit a PR and become a contributor!)

* gpt-4
* gpt-4-0613
* gpt-4-32k
* gpt-4-32k-0613
* gpt-3.5-turbo
* gpt-3.5-turbo-16k
* gpt-3.5-turbo-0613
* gpt-3.5-turbo-16k-0613
* text-embedding-ada-002
* text-davinci-003
* text-davinci-002
* code-davinci-002

## License

MIT
