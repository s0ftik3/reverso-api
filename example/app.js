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

// getContext method example
reverso.getContext('meet me half way', 'English', 'Russian').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});

// getSpellCheck method example
reverso.getSpellCheck('helo', 'English').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});

// getSynonyms method example
reverso.getSynonyms('dzień dobry', 'Polish').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});

// getTranslation method example
reverso.getTranslation('So, how is your day today?', 'English', 'French').then(response => {
    return console.log(response);
}).catch(err => {
    return console.error(err);
});