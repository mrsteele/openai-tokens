# openai-tokens
A service for calculating, managing and truncating openai prompt tokens (gpt/completions AND embeddings).

[![codecov](https://codecov.io/gh/mrsteele/openai-tokens/branch/main/graph/badge.svg?token=NCG32SMS6Z)](https://codecov.io/gh/mrsteele/openai-tokens)

## Features

This package was written by an author who actively uses OpenAI and was running into some limitations. This package helps to get you setup.

- 🏃 **FAST** - If you need to run a calculation or truncation quickly, this is the module for you!
- 🎯 **Accurate** - Use this tool if you need confidence in your prompts either before or during your API requests.
- 😌 **Seamless** - Integration should be simple. Wrappers make this accessible.
- 🔒 **Secure** - Your data is yours, this library just wants to help.

## Installation

```
npm i openai-tokens
```

## Basic Usage

### Truncate

You can use the truncate tools to enforce cutoffs of sentences that are too large. This can be automatically detected or you can provide your own limits. The truncation is programmed to break on a word, not in the middle.

```js

import {
  truncateMessage, // truncate a single message
  truncateWrapper, // truncate all messages
} from 'openai-tokens'

// The input (strings, just like prompts!)
const str = 'Trying to save money on my prompts! 💰'

// truncate with a model and we detect the token limit)
const truncatedByModel = truncateMessage(str, 'gpt-3.5-turbo')
// truncate by number, and we will use that to truncate
const truncatedByNumber = truncateMessage(str, 100)

// enforce truncation around all messages
const truncatedBody = truncateWrapper({
  model: 'gpt-4', // auto-detects token limits 🙌
  messages: [{ role: 'user', content: str }]
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
