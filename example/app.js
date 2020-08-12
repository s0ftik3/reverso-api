/*
 * Unofficial Reverso API (promise based).
 * You can either find examples of using phrases from your language
 * in target language or check spelling of your text.
 * 
 * Source: reverso.net
 * Author: github.com/s0ftik3
 */

const Reverso = require('../src/Reverso');
const reverso = new Reverso();

// Example of context(text, text-language, examples-language)
reverso.context('meet me half way', 'English', 'German')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    });

// Example of spellCheck(text, text-language)
reverso.spellCheck('helo', 'English')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    });

// Example of synonyms(text, text-language)
reverso.synonyms('dzień dobry', 'polish')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    })