# Reverso API

[![version](https://badgen.net/npm/v/reverso-api)](https://npmjs.com/package/reverso-api)
[![downloads](https://badgen.net/npm/dm/reverso-api)](https://www.npmjs.com/package/reverso-api)
[![telegram chat](https://img.shields.io/badge/Ask%20a%20Question-Telegram-blue)](https://t.me/reversoapi)

[![logotype](/assets/reversoapi-logo.png)](https://npmjs.com/package/reverso-api)

Translate, get context examples or synonyms of words - this and much more you can do with your text queries via this API wrapper.

## Navigation

-   [Installing](#installing)
-   [Usage](#usage)
-   [Examples](#examples)
    -   [getContext](#getcontext)
    -   [getSpellCheck](#getspellcheck)
    -   [getSynonyms](#getsynonyms)
    -   [getTranslation](#gettranslation)
    -   [getConjugation](#getconjugation)
-   [Credits](#credits)

## Installing

```bash
$ npm i reverso-api
```

## Usage

```javascript
const Reverso = require('reverso-api')
const reverso = new Reverso()
```

Congrats! You can use all the available methods now.\
Let's read through the README and find out how the things work.

You can pass either callback function...

```javascript
reverso.getContext(...params, (err, response) => {
    ...
})
```

or use `.then()` function.

```javascript
reverso.getContext(...params).then((response) => {
    ...
})
```

All the examples below are given using callback function.

## Examples

### `getContext`

```javascript
reverso.getContext(
    'meet me half way',
    'english',
    'russian',
    (err, response) => {
        if (err) throw new Error(err.message)

        console.log(response)
    }
)
```

Response:

```javascript
{
    ok: Boolean,
    text: String,
    source: String,
    target: String,
    translations: [String, ...],
    examples: [
        {
            id: Number,
            source: String,
            target: String
        },
        ...
    ]
}
```

Error:

```javascript
{ ok: Boolean, message: String }
```

### `getSpellCheck`

```javascript
reverso.getSpellCheck('helo', 'english', (err, response) => {
    if (err) throw new Error(err.message)

    console.log(response)
})
```

Response:

```javascript
{
    ok: Boolean,
    text: String,
    sentences: [ { startIndex: Number, endIndex: Number, status: String } ... ],
    stats: {
        textLength: Number,
        wordCount: Number,
        sentenceCount: Number,
        longestSentence: Number,
    },
    corrections: [
        {
            id: Number,
            text: String,
            type: String,
            explanation: String,
            corrected: String,
            suggestions: [
                {
                    text: String,
                    definition: String,
                    category: String,
                },
                ...
            ],
        },
    ]
}
```

Error:

```javascript
{ ok: Boolean, message: String }
```

### `getSynonyms`

```javascript
reverso.getSynonyms('dzień dobry', 'polish', (err, response) => {
    if (err) throw new Error(err.message)

    console.log(response)
})
```

Response:

```javascript
{
    ok: true,
    text: String,
    source: String,
    synonyms: [
        { id: Number, synonym: String },
        ...
    ]
}
```

Error:

```javascript
{ ok: Boolean, message: String }
```

### `getTranslation`

> ⚠️ **WARNING:** eventually, your server's IP address might get banned by Reverso moderators and you won't receive any data.

```javascript
reverso.getTranslation(
    'how is going?',
    'english',
    'chinese',
    (err, response) => {
        if (err) throw new Error(err.message)

        console.log(response)
    }
)
```

Response:

```javascript
{
    text: String,
    source: String,
    target: String,
    translations: [String, ...],
    context: {
        examples: [
            {
                source: String,
                target: String,
                source_phrases: [
                    {
                        phrase: String,
                        offset: Number,
                        length: Number
                    },
                    ...
                ],
                target_phrases: [
                    {
                        phrase: String,
                        offset: Number,
                        length: Number
                    },
                    ...
                ]
            },
            ...
        ],
        rude: Boolean
    }, // or null
    detected_language: String,
    voice: String // or null
}
```

Error:

```javascript
{ ok: Boolean, message: String }
```

### `getConjugation`

```javascript
reverso.getConjugation('идти', 'russian', (err, response) => {
    if (err) throw new Error(err.message)

    console.log(response)
})
```

Response:

```javascript
{
    ok: Boolean,
    infinitive: String,
    verbForms: [
        {
            id: Number,
            conjugation: String,
            verbs: [String, ...],
        },
        ...
    ]
}
```

Error:

```javascript
{ ok: Boolean, message: String }
```

## Credits

-   All data is provided by [reverso.net](https://reverso.net).
-   Author on Telegram [@vychs](https://t.me/vychs).
-   Want to talk about the API? Join our [Telegram chat](https://t.me/reversoapi).
