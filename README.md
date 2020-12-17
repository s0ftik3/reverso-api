# (Unofficial) Reverso API
A simple wrapper around [reverso.net](https://reverso.net).

## Installing
```
$ npm install reverso-api
```

## Usage
```javascript
const Reverso = require('reverso-api');
const reverso = new Reverso();
```
Congrats! You can use all the methods now.\
Let's read through the README and find out how it works.

### `getContext`
```javascript
reverso.getContext('meet me half way', 'English', 'Russian').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});
```
This method provides you examples of how to use a certain phrase or a word in target language.
In this case, the phrase is `meet me half way`, its language is `English` and the target language is `Russian`.

![getContext output preview](https://i.ibb.co/znw8H26/context.png)

_The method returns an object that contains given text, its language, examples' language, text's translation and examples of usage._
_Available languages for this method: English, Russian, German, Spanish, French, Italian, Polish._

### `getSpellCheck`
```javascript
reverso.getSpellCheck('helo', 'English').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});
```
This method provides you your mistakes that you might make in the text.
In this case, the text is `Helo`, its language is `English`. The response will be corrected version of the text, therefore `Hello`.

![getSpellCheck output preview](https://i.ibb.co/PYJ5rKr/spell.png)

_The method returns an array of objects._
_Available languages for this method: English and French._

### `getSynonyms`
```javascript
reverso.getSynonyms('dzień dobry', 'Polish').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});
```
This method provides you synonyms of word/phrase/sentence.
In this case, the text is `dzień dobry`, its language is `Polish`.

![getSynonyms output preview](https://i.ibb.co/RHHkLtj/synonyms.png)

_The method returns an object that contains given text, its language and array of found synonyms._
_Available languages for this method: English, Russian, German, Spanish, French, Italian, Polish._

### Info
* All the data is fetched from [reverso.net](https://reverso.net).
* Author of the API [s0ftik3](https://github.com/s0ftik3).