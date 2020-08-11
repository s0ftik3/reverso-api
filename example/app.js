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

// Example of findContext(text, text-language, examples-language)
reverso.findContext('meet me half way', 'English', 'German')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });

// Example of spellCheck(text, text-language)
reverso.spellCheck('helo', 'English')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    });