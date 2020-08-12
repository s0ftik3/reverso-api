# (Unofficial) Reverso API
A simple wrapper around [reverso.net](https://reverso.net) API.

## Installing
```
$ npm install reverso-api
```

## Usage
```javascript
const Reverso = require('reverso-api');
const reverso = new Reverso();
```
Now you're able to use all available methods.

### Find Context
```javascript
reverso.getContext('meet me half way', 'English', 'German')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    });
```
This method provides you examples of how to use a certain phrase or a word in target language.
In this case, the phrase is `meet me half way`, its language is `English` and the target language is `German`.

_The method returns an array of objects._
_Available languages for this method: English, Russian, German, Spanish, French, Italian, Polish._

### Spell Check
```javascript
reverso.getSpellCheck('helo', 'English')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    });
```
This method provides you your mistakes that you might make in the text.
In this case, the text is `Helo`, its language is `English`. The response will be corrected version of the text, therefore `Hello`.

_The method returns an array of objects._
_Available languages for this method: English and French._

### Synonyms
```javascript
reverso.getSynonyms('dzień dobry', 'Polish')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    })
```
This method provides you synonyms of a word or phrase.
In this case, the text is `dzień dobry`, its language is `Polish`.

_The method returns an array of objects._
_Available languages for this method: English, Russian, German, Spanish, French, Italian, Polish._

### Info
* All the data is fetched from [reverso.net](https://reverso.net).
* Author of the API [s0ftik3](https://github.com/s0ftik3).
