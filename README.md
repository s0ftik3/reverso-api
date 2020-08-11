# (Unofficial) Reverso API
This API allows you to find contexts and check spelling of any texts.

## Usage
```javascript
const Reverso = require('reverso-api');
const reverso = new Reverso();
```
Now you're able to use all available methods.

### Find Context
```javascript
reverso.findContext('meet me half way', 'English', 'German')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });
```
This method allows you to find out how to use a certain phrase in target language.
In this case, the phrase is `meet me half way`, its language is `English` and the target language is `German`.

![context-example](/images/context.png "Example")

_The method returns an array of objects._
_Available languages for this method: English, Russian, German._

### Spell Check
```javascript
reverso.spellCheck('helo', 'English')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });
```
This method allows you to find mistakes in your text.
In this case, the text is `Helo`, its language is `English`. The response will be corrected version of the text, therefore `Hello`.

![spell-check-example](/images/spell.png "Example")

_The method returns an array of objects._
_Available languages for this method: English and French._

### Info
* All the data is fetched from [reverso.net](https://reverso.net).
* Author of the API [s0ftik3](https://github.com/s0ftik3).