# openai-tokens
A service for calculating, managing, truncating openai tokens.

## Installation

```
npm i openai-tokens
```

## Basic Usage

```js
import { truncateMessage, verboseWrapper } from 'openai-tokens'

// enforcing limitations
const truncated = truncateMessage('gpt-3.5-turbo', 'Trying to save money on my prompts!')

// prompt validation
const promptInfo = verboseWrapper({
  model: 'gpt-4',
  messages: [{
    role: 'system',
    content: 'be snarky'
  }, {
    role: 'user',
    content: 'Will this be valid? Lets check the output...'
  }]
})

if (promptInfo.valid) {
  // actually send the prompt 😊
}


```

## Features

This package was written by an author who actively uses OpenAI and was running into some limitations. This package helps to get you setup.

1. 🎯 **Accurate** - Use this tool if you need confidence in your prompts either before or during your API requests.
2. 😌 **Seamless** - Integration should be simple. Wrappers make this accessible.
3. 🔒 **Secure** - Your data is yours, this library just wants to help.

## Advanced Usage

While this is in the early stages of development, there are some big ideas to continue to expland. Try out the following features

* **Token Truncation** - Truncate your prompts so they fit in your requests. Useful if you don't really mind having a sentence cut off. This library will cut between words until the tokens fit in the request.
* **Verbose Information** - This service can be used to measure impact before sendoff. It provides information for you to determine if the request will work for your ideal limitations.

### Verbose

A common use for this can expose the expected results

```js
import { verboseWrapper } from 'openai-tokens'

const info = verboseWrapper({
  model: 'gpt-3.5-turbo', // auto-detects model for limits
  messages: [{
    role: 'system',
    content: 'Reply in markdown'
  }, {
    role: 'user',
    content: 'Really long text!... (pretend this goes on forever)'
  }]
})

console.log(info)
/*
{
  tokenLimit: 2048, // The allowed limit
  tokenTotal: 12345, // The total use
  cost: 0.00002, // the total cost of the request
  valid: true // True or False depending on if the prompt is under the limit
}
*/
```

### Truncate

If you would like to limit a single prompt, use the code below.

```js
import { truncateMessage } from 'openai-tokens'

// truncate with a model
const prompt1 = truncateMessage('gpt-3-turbo', 'Really long text!... (pretend this goes on forever)')

// truncate with a specific token limit
const prompt2 = truncateMessage(1000, 'Really long text!... (pretend this goes on forever)')

// feel free to 
```

## Additional Information

### Undetected Models

If you provide a model that is not supported, you will get a console message as well as no boundaries by default on the request.

## License

MIT
