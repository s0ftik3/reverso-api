# Reverso API
[![version](https://badgen.net/npm/v/reverso-api)](https://npmjs.com/package/reverso-api)
[![downloads](https://badgen.net/npm/dm/reverso-api)](https://www.npmjs.com/package/reverso-api)
[![telegram chat](https://img.shields.io/badge/Ask%20a%20Question-Telegram-blue)](https://t.me/reversoapi)

[![logotype](/assets/reversoapi-logo.png)](https://npmjs.com/package/reverso-api)

This API is not official! It allows you to manipulate with your text in different ways. Almost all the features from the website are supported by this API. Currently supported: context, translation, spell check, synonyms.

## Navigation
- [Installing](#installing)
- [Usage](#usage)
- [Examples](#examples)
    - [getContext](#getcontext)
    - [getSpellCheck](#getspellcheck)
    - [getSynonyms](#getsynonyms)
    - [getTranslation](#gettranslation)
- [Languages](#languages)
- [Credits](#credits)

## Installing
```bash
$ npm i reverso-api
```

## Usage
```javascript
const Reverso = require('reverso-api');
const reverso = new Reverso();
```
Congrats! You can use all the available methods now.\
Let's read through the README and find out how the things work.

You can pass either callback function...
```javascript
reverso.getContext(...params, (response) => {
    ...
});
```

or use `.then()` function.

```javascript
reverso.getContext(...params).then((response) => {
    ...
});
```

All the examples below are given using callback function.

## Examples
- ### `getContext`
```javascript
reverso.getContext('meet me half way', 'English', 'Russian', (response) => {
    console.log(response);
}).catch((err) => {
    console.error(err);
});
```

Response:
```javascript
{
    text: String,
    from: String,
    to: String,
    translation: [String, ...],
    examples: [
        {
            id: Number,
            from: String,
            to: String
        },
        ...
    ]
}
```

Error:
```javascript
{ method: String, error: String }
```

- ### `getSpellCheck`
```javascript
reverso.getSpellCheck('helo', 'English', (response) => {
    console.log(response);
}).catch((err) => {
    console.error(err);
});
```

Response:
```javascript
[
    {
        id: Number,
        text: String,
        type: String,
        explanation: String,
        corrected: String,
        full_corrected: String
    }
]
```

Error:
```javascript
{ method: String, error: String }
```

- ### `getSynonyms`
```javascript
reverso.getSynonyms('dzień dobry', 'Polish', (response) => {
    console.log(response);
}).catch((err) => {
    console.error(err);
});
```

Response:
```javascript
{
    text: String,
    from: String,
    synonyms: [
        { id: Number, synonym: String },
        ...
    ]
}
```

Error:
```javascript
{ method: String, error: String }
```

- ### `getTranslation`
> ⚠️ **WARNING:** eventually, your server's IP address might get banned by Reverso moderators and you won't receive any data.
```javascript
reverso.getTranslation('how is going?', 'English', 'Chinese', (response) => {
    console.log(response);
}).catch((err) => {
    console.error(err);
});
```

Response:
```javascript
{
    text: String,
    from: String,
    to: String,
    translation: [String, ...],
    context: {
        examples: [
            {
                from: String,
                to: String,
                phrase_from: String,
                phrase_to: String
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
{ method: String, error: String }
```

## Languages
`getContext` & `getTranslation`: English, Arabic, German, Spanish, French, Hebrew, Italian, Japanese, Dutch, Polish, Portuguese, Romanian, Russian, Turkish, Chinese. \
`getSynonyms`: English, Russian, German, Spanish, French, Italian, Polish. \
`getSpellCheck`: English, French

## Credits
* All data is provided by [reverso.net](https://reverso.net).
* Author on Telegram [@vychs](https://t.me/vychs).
* Want to talk about the API? Join our [Telegram chat](https://t.me/reversoapi).