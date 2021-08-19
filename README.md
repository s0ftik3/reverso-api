# (Unofficial) Reverso API
The API allows you to manipulate with your text in different ways. Almost all the features from the website are supported by this API. Currently supported: context, translation, spell check, synonyms.

## Navigation
- [Installing](#installing)
- [Usage](#usage)
- [Examples](#examples)
    - [getContext](#getcontext)
    - [getSpellCheck](#getspellcheck)
    - [getSynonyms](#getsynonyms)
    - [getTranslation](#gettranslation)
- [Credits](#credits)

## Installing
```bash
$ npm install reverso-api
```

## Usage
```javascript
const Reverso = require('reverso-api');
const reverso = new Reverso();
```
Congrats! You can use all the available methods now.\
Let's read through the README and find out how the things work.

Remember, you can pass either callback function...
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

All the examples below will be given using callback function.

## Examples
### `getContext`
```javascript
reverso.getContext('meet me half way', 'English', 'Russian', (response) => {
    console.log(response);
}).catch(err => {
    console.error(err);
});
```

Response:
```json
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
```json
{ method: String, error: String }
```

_Available languages for this method: English, Russian, German, Spanish, French, Italian, Polish, Chinese._

### `getSpellCheck`
```javascript
reverso.getSpellCheck('helo', 'English', (response) => {
    console.log(response);
}).catch(err => {
    console.error(err);
});
```

Response:
```json
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
```json
{ method: String, error: String }
```

_Available languages for this method: English and French._

### `getSynonyms`
```javascript
reverso.getSynonyms('dzień dobry', 'Polish', (response) => {
    console.log(response);
}).catch(err => {
    console.error(err);
});
```

Response:
```json
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
```json
{ method: String, error: String }
```

_Available languages for this method: English, Russian, German, Spanish, French, Italian, Polish._

### `getTranslation`
> **WARNING:** eventually, your server's IP address might get banned by Reverso moderators and you won't receive any data.
```javascript
reverso.getTranslation('Hello', 'English', 'French', (response) => {
    console.log(response);
}).catch(err => {
    console.error(err);
});
```

Response:
```json
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
```json
{ method: String, error: String }
```

_Available languages for this method: English, Russian, German, Spanish, French, Italian, Polish._

### Credits
* All the data is fetched from [reverso.net](https://reverso.net).
* Author of the API [@vychs](https://t.me/vychs).