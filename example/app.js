/*
 * Unofficial Reverso API (promise-based).
 * The API allows you to manipulate with your text in different ways.
 * Almost all the features from the website are supported by this API.
 * Currently supported: context, translation, spell check, synonyms.
 *
 * Source: reverso.net
 * Author: github.com/s0ftik3
 */

const Reverso = require('../src/Reverso');
const reverso = new Reverso();

// getContext method example
reverso
    .getContext('meet me half way', 'English', 'Russian', (response) => {
        console.log(response);
    })
    .catch((err) => {
        console.error(err);
    });

// getSpellCheck method example
reverso
    .getSpellCheck('helo', 'English', (response) => {
        console.log(response);
    })
    .catch((err) => {
        console.error(err);
    });

// getSynonyms method example
reverso
    .getSynonyms('dzień dobry', 'Polish', (response) => {
        console.log(response);
    })
    .catch((err) => {
        console.error(err);
    });

// getTranslation method example
reverso
    .getTranslation('how is going?', 'English', 'Chinese', (response) => {
        console.log(response);
    })
    .catch((err) => {
        console.error(err);
    });
