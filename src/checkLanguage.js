/*
 * Unofficial Reverso API (promise-based).
 * The API allows you to manipulate with your text in different ways.
 * Almost all the features from the website are supported by this API.
 * Currently supported: context, translation, spell check, synonyms.
 * 
 * Source: reverso.net
 * Author: github.com/s0ftik3
 */

module.exports = (method = null, from_language = null, to_language = null) => {
    return new Promise((resolve, reject) => {
        if (method === null) return reject({ error: 'Method param must be filled.' });
        if (from_language === null) return reject({ error: 'From language param must be filled.' });

        if (to_language === null) {
            if (typeof from_language !== 'string') {
                reject({ error: 'Incorrect param\'s type. Must be type of string.' });
                return;
            }

            switch(method) {
                case 'spell':
                    const spell_languages = require('./languages/spell');

                    if (spell_languages.includes(from_language)) {
                        resolve(true);
                    } else {
                        reject({ error: 'Incorrect language specified.' });
                    }

                    break;
                case 'synonym':
                    const synonym_languages = require('./languages/synonym');

                    if (synonym_languages.includes(from_language)) {
                        resolve(true);
                    } else {
                        reject({ error: 'Incorrect language specified.' });
                    }

                    break;
                default:
                    reject({ error: 'Incorrect method name.' });
                    break;
            }
        } else {
            if (typeof from_language !== 'string' && typeof to_language !== 'string') {
                reject({ error: 'Incorrect params\' type. Must be type of string.' });
                return;
            }

            switch(method) {
                case 'context':
                    const context_languages = require('./languages/context');

                    if (context_languages.includes(from_language) && context_languages.includes(to_language)) {
                        resolve(true);
                    } else {
                        reject({ error: 'Incorrect languages specified.' });
                    }

                    break;
                case 'translation':
                    const translation_languages = require('./languages/translation');

                    if (translation_languages.includes(from_language) && translation_languages.includes(to_language)) {
                        resolve(true);
                    } else {
                        reject({ error: 'Incorrect languages specified.' });
                    }

                    break;
                default:
                    reject({ error: 'Incorrect method name.' });
                    break;
            }
        }
    });  
};