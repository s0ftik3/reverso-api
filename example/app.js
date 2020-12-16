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

// Example of getContext(text, text-language, examples-language)
reverso.getContext('meet me half way', 'English', 'Russian')
    .then((response) => {
        return console.log(response);
    })
    .catch((error) => {
        return console.log(error);
    });

// // Example of getSpellCheck(text, text-language)
// reverso.getSpellCheck('helo', 'English')
//     .then((response) => {
//         return console.log(response);
//     })
//     .catch((error) => {
//         return console.log(error);
//     });

// // Example of getSynonyms(text, text-language)
// reverso.getSynonyms('dzień dobry', 'Polish')
//     .then((response) => {
//         return console.log(response);
//     })
//     .catch((error) => {
//         return console.log(error);
//     })