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

const axios = require('axios');
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');
const constants = require('./constants');
const checkLanguage = require('./utils/checkLanguage');

module.exports = class Reverso {
    /**
     * The same as context feature on reverso.net
     * @param {String} text Your query.
     * @param {String} from Available languages: English, Russian, German, Spanish, French, Italian, Polish, Chinese.
     * @param {String} to Available languages: English, Russian, German, Spanish, French, Italian, Polish, Chinese.
     * @param {Function} callback Your callback function. Not important.
     * @returns An object with data or an object with error(s).
     */
    getContext(text, from, to, callback) {
        return new Promise(async (resolve, reject) => {
            const from_language = from.toLowerCase();
            const to_language = to.toLowerCase();

            const is_correct_language = await checkLanguage(
                'context',
                from_language,
                to_language,
            ).catch((err) => err);
            if (is_correct_language?.error)
                return reject({ method: 'getContext', ...is_correct_language });

            axios({
                method: 'GET',
                url:
                    constants.CONTEXT_URL +
                    from_language +
                    '-' +
                    to_language +
                    '/' +
                    encodeURIComponent(text),
                headers: {
                    Accept: '*/*',
                    Connection: 'keep-alive',
                    'User-Agent': randomUseragent.getRandom(),
                },
            })
                .then((response) => {
                    const $ = cheerio.load(response.data);
                    const examples = [];
                    const translation = [];

                    const from_example = $('body')
                        .find('.example')
                        .find(
                            `div[class="src ${
                                from_language === 'arabic'
                                    ? 'rtl arabic'
                                    : from_language === 'hebrew'
                                    ? 'rtl'
                                    : 'ltr'
                            }"] > span[class="text"]`,
                        )
                        .text()
                        .trim()
                        .split('\n');
                    const to_example = $('body')
                        .find('.example')
                        .find(
                            `div[class="trg ${
                                to_language === 'arabic'
                                    ? 'rtl arabic'
                                    : to_language === 'hebrew'
                                    ? 'rtl'
                                    : 'ltr'
                            }"] > span[class="text"]`,
                        )
                        .text()
                        .trim()
                        .split('\n');
                    const to_translation = $('body')
                        .find('div[id="translations-content"]')
                        .text()
                        .split('\n');

                    for (let i = 0; i < from_example.length; i++) {
                        examples.push({
                            id: i,
                            from: from_example[i].trimStart(),
                            to: to_example[i].trimStart(),
                        });
                    }

                    to_translation.forEach((e) => {
                        let string = e.trim();
                        if (string.length <= 0) return;
                        translation.push(e.trim());
                    });

                    if (typeof callback === 'function') {
                        callback({
                            text: text,
                            from: from,
                            to: to,
                            translation: translation.filter((e) => e != text),
                            examples: examples,
                        });
                    } else {
                        resolve({
                            text: text,
                            from: from,
                            to: to,
                            translation: translation.filter((e) => e != text),
                            examples: examples,
                        });
                    }
                })
                .catch((err) => {
                    reject({ method: 'getContext', error: err });
                });
        });
    }

    /**
     * The same as spell checker on reverso.net
     * @param {String} text Your query.
     * @param {String} from Available languages: English and French.
     * @param {Function} callback Your callback function. Not important.
     * @returns {Promise <Array>} An array with data objects or an object with error(s).
     */
    getSpellCheck(text, from, callback) {
        return new Promise(async (resolve, reject) => {
            const from_language = from.toLowerCase();

            const is_correct_language = await checkLanguage(
                'spell',
                from_language,
            ).catch((err) => err);
            if (is_correct_language?.error)
                return reject({
                    method: 'getSpellCheck',
                    ...is_correct_language,
                });

            const languages = {
                english: 'eng',
                french: 'fra',
            };

            axios({
                method: 'GET',
                url:
                    constants.SPELLCHECK_URL +
                    '?text=' +
                    encodeURIComponent(text) +
                    '&language=' +
                    languages[from_language] +
                    '&getCorrectionDetails=true',
                headers: {
                    Accept: '*/*',
                    Connection: 'keep-alive',
                    'User-Agent': randomUseragent.getRandom(),
                },
            })
                .then((response) => {
                    const data = response.data;
                    const result = [];

                    for (let i = 0; i < data.corrections.length; i++) {
                        result.push({
                            id: i,
                            text: text,
                            type: data.corrections[i].type,
                            explanation: data.corrections[i].longDescription,
                            corrected: data.corrections[i].correctionText,
                            full_corrected: data.text,
                        });
                    }

                    if (typeof callback === 'function') {
                        callback(result);
                    } else {
                        resolve(result);
                    }
                })
                .catch((err) => {
                    reject({ method: 'getSpellCheck', error: err });
                });
        });
    }

    /**
     * The same as synonyms feature on reverso.net
     * @param {String} text Your query.
     * @param {String} from Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @param {Function} callback Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @returns An object with data or an object with error(s).
     */
    getSynonyms(text, from, callback) {
        return new Promise(async (resolve, reject) => {
            const from_language = from.toLowerCase();

            const is_correct_language = await checkLanguage(
                'synonym',
                from_language,
            ).catch((err) => err);
            if (is_correct_language?.error)
                return reject({
                    method: 'getSynonyms',
                    ...is_correct_language,
                });

            const languages = {
                english: 'en',
                french: 'fr',
                german: 'de',
                russian: 'ru',
                italian: 'it',
                polish: 'pl',
                spanish: 'es',
            };

            axios({
                method: 'GET',
                url:
                    constants.SYNONYMS_URL +
                    languages[from_language] +
                    '/' +
                    encodeURIComponent(text),
                headers: {
                    Accept: '*/*',
                    Connection: 'keep-alive',
                    'User-Agent': randomUseragent.getRandom(),
                },
            })
                .then((response) => {
                    const $ = cheerio.load(response.data);
                    const synonyms = [];

                    $('body')
                        .find(`a[class="synonym  relevant"]`)
                        .each((i, e) => {
                            synonyms.push({
                                id: i,
                                synonym: $(e).text(),
                            });
                        });

                    if (typeof callback === 'function') {
                        callback({
                            text: text,
                            from: from_language,
                            synonyms: synonyms,
                        });
                    } else {
                        resolve({
                            text: text,
                            from: from_language,
                            synonyms: synonyms,
                        });
                    }
                })
                .catch((err) => {
                    reject({ method: 'getSynonyms', error: err });
                });
        });
    }

    /**
     * The same as translation feature on reverso.net
     * @param {String} text Your query.
     * @param {String} from Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @param {String} to Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @param {Function} callback Your callback function. Not important.
     * @returns An object with data or an object with error(s).
     */
    getTranslation(text, from, to, callback) {
        return new Promise(async (resolve, reject) => {
            const from_language = from.toLowerCase();
            const to_language = to.toLowerCase();

            const is_correct_language = await checkLanguage(
                'translation',
                from_language,
                to_language,
            ).catch((err) => err);
            if (is_correct_language?.error)
                return reject({
                    method: 'getTranslation',
                    ...is_correct_language,
                });

            const languages = {
                arabic: 'ara',
                german: 'ger',
                spanish: 'spa',
                french: 'fra',
                hebrew: 'heb',
                italian: 'ita',
                japanese: 'jpn',
                dutch: 'dut',
                polish: 'pol',
                portuguese: 'por',
                romanian: 'rum',
                russian: 'rus',
                turkish: 'tur',
                chinese: 'chi',
                english: 'eng',
            };

            const voices = {
                arabic: 'Mehdi22k',
                german: 'Claudia22k',
                spanish: 'Ines22k',
                french: 'Alice22k',
                hebrew: 'he-IL-Asaf',
                italian: 'Chiara22k',
                japanese: 'Sakura22k',
                dutch: 'Femke22k',
                polish: 'Ania22k',
                portuguese: 'Celia22k',
                romanian: 'ro-RO-Andrei',
                russian: 'Alyona22k',
                turkish: 'Ipek22k',
                chinese: 'Lulu22k',
                english: 'Heather22k',
            };

            axios({
                method: 'POST',
                url: constants.TRANSLATION_URL,
                headers: {
                    Accept: '*/*',
                    Connection: 'keep-alive',
                    'User-Agent': randomUseragent.getRandom(),
                    'Content-Type': 'application/json',
                },
                data: {
                    format: 'text',
                    from: languages[from_language],
                    input: text,
                    options: {
                        contextResults: true,
                        languageDetection: true,
                        origin: 'reversomobile',
                        sentenceSplitter: false,
                    },
                    to: languages[to_language],
                },
            })
                .then((response) => {
                    const text_to_voice = Buffer.from(
                        response.data.translation[0],
                    ).toString('base64');
                    const condition =
                        voices[to_language] != undefined &&
                        response.data.translation[0].length <= 150;

                    if (response.data?.contextResults?.results) {
                        const context_examples = [];

                        const source_examples =
                            response.data.contextResults.results[0]
                                .sourceExamples;
                        const target_examples =
                            response.data.contextResults.results[0]
                                .targetExamples;

                        for (let i = 0; i < source_examples.length; i++) {
                            context_examples.push({
                                from: source_examples[i].replace(
                                    /<[^>]*>/gi,
                                    '',
                                ),
                                to: target_examples[i].replace(/<[^>]*>/gi, ''),
                                phrase_from: [
                                    ...source_examples[i].matchAll(
                                        /<em>(.*?)<\/em>/g,
                                    ),
                                ][0][1],
                                phrase_to: [
                                    ...target_examples[i].matchAll(
                                        /<em>(.*?)<\/em>/g,
                                    ),
                                ][0][1],
                            });
                        }

                        if (typeof callback === 'function') {
                            callback({
                                text: text,
                                from: from_language,
                                to: to_language,
                                translation: response.data.translation,
                                context: {
                                    examples: context_examples,
                                    rude: response.data.contextResults
                                        .results[0].rude,
                                },
                                detected_language:
                                    response.data.languageDetection
                                        .detectedLanguage,
                                voice: condition
                                    ? `${constants.VOICE_URL}voiceName=${voices[to_language]}?inputText=${text_to_voice}`
                                    : null,
                            });
                        } else {
                            resolve({
                                text: text,
                                from: from_language,
                                to: to_language,
                                translation: response.data.translation,
                                context: {
                                    examples: context_examples,
                                    rude: response.data.contextResults
                                        .results[0].rude,
                                },
                                detected_language:
                                    response.data.languageDetection
                                        .detectedLanguage,
                                voice: condition
                                    ? `${constants.VOICE_URL}voiceName=${voices[to_language]}?inputText=${text_to_voice}`
                                    : null,
                            });
                        }
                    } else {
                        if (typeof callback === 'function') {
                            callback({
                                text: text,
                                from: from_language,
                                to: to_language,
                                translation: response.data.translation,
                                context: null,
                                detected_language:
                                    response.data.languageDetection
                                        .detectedLanguage,
                                voice: condition
                                    ? `${constants.VOICE_URL}voiceName=${voices[to_language]}?inputText=${text_to_voice}`
                                    : null,
                            });
                        } else {
                            resolve({
                                text: text,
                                from: from_language,
                                to: to_language,
                                translation: response.data.translation,
                                context: null,
                                detected_language:
                                    response.data.languageDetection
                                        .detectedLanguage,
                                voice: condition
                                    ? `${constants.VOICE_URL}voiceName=${voices[to_language]}?inputText=${text_to_voice}`
                                    : null,
                            });
                        }
                    }
                })
                .catch((err) => {
                    reject({ method: 'getTranslation', error: err });
                });
        });
    }
};
