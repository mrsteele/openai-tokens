# openai-tokens
Accurate token measurment and truncation for OpenAI GPT prompts and embeddings.

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

### Automatically swapping models based on token size

If you have too much content in your request, you can change your model dynamically so you use an appropriate size for each request.

```js
const { dynamicWrapper } = require('openai-tokens')

const chat = async (messages = []) => {
  const body = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    // wrap your original content with minor adjustments
    body: dynamicWrapper({
      // we test all models till we find a valid one based on the prompt size
      model: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
      messages: [{
        role: 'user',
        content: 'This prmopt is small, so its going to go with the first one'
      }],
      // optional arguments we can also pass in
      opts: {
        buffer: 1000, // add a buffer to make sure GPT can respond
        stringify: true // return the results as a string
      }
    }),
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  
...
```

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
  body: truncateWrapper({
    mode: 'text-embedding-ada-002',
    opts: {
      stringify: true // we will even take care of this for you
    },
    inputs: ['large data set, pretend this goes on for most of eternity...']
  })
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

#### Options

You can pass options to the truncate wrapper as seen in the examples above. The following are the current supported options:

* **limit** (Int) - The token limit you want to enforce on the messages/input. This is the aggregated results for messages (GPT/Completions), and the individual results for inputs/embeddings which is how they are calculated by OpenAI. Defaults to the model maximum.
* **buffer** (Int) - The amount of additional restriction you want to apply to the limit. The math equates to `max = limit - buffer`. Defaults to `0`.
* **stringify** (Bool) - If you want the output to be a stringified JSON object instead of a parsed JSON object. Defaults to `false`

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

This service will support maximum request sizes. So if you want to leave room to respond, make sure you support a buffer.

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
