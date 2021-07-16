'use-strict';

const axios = require('axios');
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');
const urls = require('./urls');
const { 
    checkContextLang, 
    checkSpellLang, 
    checkSynonymsLang, 
    checkTranslationLang
} = require('./langcheck');

module.exports = class Reverso {
    /**
     * Retrieves information about target text as its translation, usage examples.
     * Tests have shown that the method's average latency is ~1.3sec.
     * @public
     * @param {string} text word/phrase/sentence in source language
     * @param {string} from source language of the text. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @param {string} to target language of examples you need. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     */
    async getContext(text, from, to) {
        checkContextLang(from, to);

        const url = urls.contextUrl + from.toLowerCase() + '-' + to.toLowerCase() + '/' + encodeURIComponent(text);

        const result = await axios({
            method: 'GET',
            url: url,
            headers: {
                Accept: '*/*',
                Connection: 'keep-alive',
                'User-Agent': randomUseragent.getRandom()
            }
        }).then(response => {
            const $ = cheerio.load(response.data);
            const examples = [];
            const translation = [];

            const fromExample = $('body').find('.example').find('div[class="src ltr"] > span[class="text"]').text().trim().split('\n');
            const toExample = $('body').find('.example').find('div[class="trg ltr"] > span[class="text"]').text().trim().split('\n');
            const toTranslation = $('body').find('div[id="translations-content"]').text().split('\n');

            for (let i = 0; i < fromExample.length; i++) {
                examples.push({
                    id: i,
                    from: fromExample[i].trimStart(),
                    to: toExample[i].trimStart(),
                });
            }

            toTranslation.forEach((e) => {
                let string = e.trim();
                if (string.length <= 0) return;
                translation.push(e.trim());
            });

            return {
                text: text,
                from: from,
                to: to,
                translation: translation.filter((e) => e != text),
                examples: examples,
            };
        }).catch(console.error);

        return result;
    }

    /**
     * Retrieves information about target text as its spelling.
     * Tests have shown that the method's average latency is ~420ms.
     * @public
     * @param {string} text word/phrase/sentence in source language
     * @param {string} lang source language of the text. Available languages: English and French.
     */
    async getSpellCheck(text, lang) {
        checkSpellLang(lang);

        const resLang = {
            english: 'eng',
            french: 'fra',
        };

        const url = urls.spellCheckUrl + `?text=${encodeURIComponent(text)}&language=${resLang[lang.toLowerCase()]}&getCorrectionDetails=true`;

        const result = await axios({
            method: 'GET',
            url: url,
            headers: {
                Accept: '*/*',
                Connection: 'keep-alive',
                'User-Agent': randomUseragent.getRandom()
            }
        }).then(response => {
            const data = response.data;
            const _result = [];

            for (let i = 0; i < data.corrections.length; i++) {
                _result.push({
                    id: i,
                    text: text,
                    type: data.corrections[i].type,
                    explanation: data.corrections[i].longDescription,
                    corrected: data.corrections[i].correctionText,
                    full_corrected: data.text,
                });
            }

            return _result;
        }).catch(console.error);

        return result;
    }

    /**
     * Retrieves synonymous of target text.
     * Tests have shown that the method's average latency is ~900ms.
     * @public
     * @param {string} text word/phrase/sentence in source language
     * @param {string} lang source language of the text. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     */
    async getSynonyms(text, lang) {
        checkSynonymsLang(lang);

        const resLang = {
            english: 'en',
            french: 'fr',
            german: 'de',
            russian: 'ru',
            italian: 'it',
            polish: 'pl',
            spanish: 'es',
        };

        const url = urls.synonymsUrl + `${resLang[lang.toLowerCase()]}/${encodeURIComponent(text)}`;

        const result = await axios({
            method: 'GET',
            url: url,
            headers: {
                Accept: '*/*',
                Connection: 'keep-alive',
                'User-Agent': randomUseragent.getRandom()
            }
        }).then(response => {
            const $ = cheerio.load(response.data);
            const synonyms = [];

            $('body').find(`a[class="synonym  relevant"]`).each((i, e) => {
                synonyms.push({
                    id: i,
                    synonym: $(e).text(),
                });
            });

            return {
                text: text,
                from: lang,
                synonyms: synonyms,
            };
        }).catch(console.error);

        return result;
    }

    /**
     * Retrieves translation of a word or a sentence.
     * Tests have shown that the method's average latency is ~1000ms
     * Note: voice is currently available for English and Russian texts.
     * @public
     * @param {string} text word/phrase/sentence in source language
     * @param {string} from source language of the text. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @param {string} to target language of examples you need. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     */
    async getTranslation(text, from, to) {
        checkTranslationLang(from, to);

        const language = {
            english: 'eng',
            french: 'fra',
            german: 'ger',
            russian: 'rus',
            italian: 'ita',
            polish: 'pol',
            spanish: 'spa',
        };

        const voice = {
            english: 'Heather22k',
            french: 'Alice22k',
            german: 'Claudia22k',
            russian: 'Alyona22k',
            italian: 'Chiara22k',
            polish: 'Ania22k',
            spanish: 'Ines22k',
        };

        const result = await axios.post(urls.translation, {
            format: 'text',
            from: language[from.toLowerCase()],
            input: text,
            options: {
                contextResults: true,
                languageDetection: true,
                origin: 'reversomobile',
                sentenceSplitter: false,
            },
            to: language[to.toLowerCase()],
            headers: {
                Accept: '*/*',
                Connection: 'keep-alive',
                'User-Agent': randomUseragent.getRandom(),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const textToVoice = Buffer.from(response.data.translation[0]).toString('base64');
            const condition = voice[to.toLowerCase()] != undefined && response.data.translation[0].length <= 150;

            const contextExamples = [];

            if (response.data.contextResults == null || response.data.contextResults.results.length <= 0) {
                return {
                    text: text,
                    from: response.data.from,
                    to: response.data.to,
                    translation: response.data.translation,
                    context: {
                        examples: 'no context examples',
                        rude: 'not defined',
                    },
                    detected_language: response.data.languageDetection.detectedLanguage,
                    voice: condition ? `${urls.voice}voiceName=${voice[to.toLowerCase()]}?inputText=${textToVoice}` : false,
                };
            } else {
                let sourceExamples = response.data.contextResults.results[0].sourceExamples;
                let targetExamples = response.data.contextResults.results[0].targetExamples;

                for (let i = 0; i < sourceExamples.length; i++) {
                    contextExamples.push({
                        from: sourceExamples[i].replace(/<[^>]*>/gi, ''),
                        to: targetExamples[i].replace(/<[^>]*>/gi, ''),
                        phrase_from: [...sourceExamples[i].matchAll(/<em>(.*?)<\/em>/g)][0][1],
                        phrase_to: [...targetExamples[i].matchAll(/<em>(.*?)<\/em>/g)][0][1]
                    });
                }

                return {
                    text: text,
                    from: response.data.from,
                    to: response.data.to,
                    translation: response.data.translation,
                    context: {
                        examples: contextExamples,
                        rude: response.data.contextResults.results[0].rude,
                    },
                    detected_language: response.data.languageDetection.detectedLanguage,
                    voice: condition ? `${urls.voice}voiceName=${voice[to.toLowerCase()]}?inputText=${textToVoice}` : false,
                };
            }
        }).catch(console.error);

        return result;
    }
};