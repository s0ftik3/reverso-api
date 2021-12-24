/*
 * Unofficial Reverso API (promise-based).
 * The API allows you to manipulate with your text in different ways.
 * Almost all the features from the website are supported by this API.
 * Currently supported: context, translation, spell check, synonyms.
 * 
 * Source: reverso.net
 * Author: github.com/s0ftik3
 */

'use-strict';

const compatibility = require('../languages/compatibility.json');

module.exports = (method = null, from_language = null, to_language = null) => {
    return new Promise((resolve, reject) => {
        if (method === null) return reject({ error: 'Method\'s param must be filled.' });
        if (from_language === null) return reject({ error: 'From language param must be filled.' });
        if (to_language === null) return reject({ error: 'To language param must be filled.' });
        if (typeof from_language !== 'string' && typeof to_language !== 'string') {
            reject({ error: 'Incorrect langauge params\' type. Must be type of string.' });
            return;
        }

        switch(method) {
            case 'context':
                const context_data = compatibility.find(e => e.method === 'context');
                const c_compatible_languages = context_data.language.find(e => e.name === from_language).compatible_with;

                if (c_compatible_languages.includes(to_language)) {
                    resolve(true);
                } else {
                    reject({ error: 'Unsupported languages\' combination.' })
                }
                
                break;
            case 'translation':
                const translation_data = compatibility.find(e => e.method === 'translation');
                const t_compatible_languages = translation_data.language.find(e => e.name === from_language).compatible_with;

                if (t_compatible_languages.includes(to_language)) {
                    resolve(true);
                } else {
                    reject({ error: 'Unsupported languages\' combination.' })
                }

                break;
            default:
                reject({ error: 'Incorrect method\'s name.' });
                break;
        }
    });  
};