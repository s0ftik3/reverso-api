const axios = require('axios');
const cheerio = require('cheerio');
const urls = require('./urls'); 
const { 
    checkContextLang, 
    checkSpellLang, 
    checkSynonymsLang,
    checkTranslationLang
} = require('./langcheck');

class Reverso {

    /**
     * Retrieves information about target text as its translation, usage examples.
     * Tests have shown that the method's average latency is ~1.3sec.
     * @public
     * @param {string} text word/phrase/sentence in source language
     * @param {string} from source language of the text. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @param {string} to target language of examples you need. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     */
    getContext(text, from, to) {
        checkContextLang(from, to);

        let url = urls.contextUrl + from.toLowerCase() + '-' + to.toLowerCase() + '/' + encodeURIComponent(text);

        return axios(url).then((response) => {
            const $ = cheerio.load(response.data);
            let examples = [];
            let translation = [];

            let fromExample = $('body').find('.example').find('div[class="src ltr"] > span[class="text"]').text().trim().split('\n');
            let toExample = $('body').find('.example').find('div[class="trg ltr"] > span[class="text"]').text().trim().split('\n');
            let toTranslation = $('body').find('div[id="translations-content"]').text().split('\n');

            for (let i = 0; i < fromExample.length; i++) {
                examples.push({
                    id: i,
                    from: fromExample[i].trimStart(),
                    to: toExample[i].trimStart()
                });
            }

            toTranslation.forEach(e => {
                let string = e.trim();
                if (string.length <= 0) return;
                translation.push(e.trim());
            });

            return {
                text: text,
                from: from,
                to: to,
                translation: translation,
                examples: examples
            };

        }).catch((err) => { throw new Error('reverso.net did not respond or there are no context examples for the given text.\n' + err) });
    }

    /**
     * Retrieves information about target text as its spelling.
     * Tests have shown that the method's average latency is ~420ms.
     * @public
     * @param {string} text word/phrase/sentence in source language
     * @param {string} lang source language of the text. Available languages: English and French.
     */
    getSpellCheck(text, lang) {
        checkSpellLang(lang);
        
        let resLang = {
            'english': 'eng',
            'french': 'fra'
        };

        let url = urls.spellCheckUrl + `?text=${encodeURIComponent(text)}&language=${resLang[lang.toLowerCase()]}&getCorrectionDetails=true`;

        return axios.get(url).then((response) => {
            let data = response.data;
            let result = [];

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

            return result;
        }).catch((err) => { throw new Error('reverso.net did not respond or your text has no mistakes.\n' + err) });
    }

    /**
     * Retrieves synonymous of target text.
     * Tests have shown that the method's average latency is ~900ms.
     * @public
     * @param {string} text word/phrase/sentence in source language
     * @param {string} lang source language of the text. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     */
    getSynonyms(text, lang) {
        checkSynonymsLang(lang);

        let resLang = {
            'english': 'en',
            'french': 'fr',
            'german': 'de',
            'russian': 'ru',
            'italian': 'it',
            'polish': 'pl',
            'spanish': 'es'
        };

        let url = urls.synonymsUrl + `${resLang[lang.toLowerCase()]}/${encodeURIComponent(text)}`;

        return axios.get(url).then((response) => {
            const $ = cheerio.load(response.data);
            const synonyms = [];

            // thanks to https://stackoverflow.com/questions/32655076/cheerio-jquery-selectors-how-to-get-a-list-of-elements-in-nested-divs
            $('body').find(`a[class="synonym  relevant"]`).each((i, e) => {
                synonyms.push({
                    id: i,
                    synonym: $(e).text()
                });
            });

            return {
                text: text,
                from: lang,
                synonyms: synonyms
            };
        }).catch((err) => { throw new Error('reverso.net did not respond or there are no synonyms for the given text.\n' + err) });
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
    getTranslation(text, from, to) {
        checkTranslationLang(from, to);

        let lang = {
            'english': 'eng',
            'french': 'fra',
            'german': 'ger',
            'russian': 'rus',
            'italian': 'ita',
            'polish': 'pol',
            'spanish': 'spa'
        };

        return axios.post(urls.translation, {
            format: 'text',
            from: lang[from.toLowerCase()],
            input: text,
            options: {
                contextResults: true,
                languageDetection: true,
                origin: 'reversomobile',
                sentenceSplitter: false
            },
            to: lang[to.toLowerCase()]
        }).then(response => {

            let textToVoice = Buffer.from(response.data.translation[0]).toString('base64');
            let condition = lang[to.toLowerCase()] == 'eng' || lang[to.toLowerCase()] == 'rus' && response.data.translation[0].length <= 150;

            let contextExamples = [];

            if (response.data.contextResults == null) {

                return {
                    text: text,
                    from: response.data.from,
                    to: response.data.to,
                    translation: response.data.translation,
                    context: {
                        examples: 'no context examples',
                        rude: 'not defined'
                    },
                    detected_language: response.data.languageDetection.detectedLanguage,
                    voice: (condition) ? `${urls.voice}voiceName=${lang[to.toLowerCase()] == 'eng' ? 'Heather' : 'Alyona'}22k?inputText=${textToVoice}` : false
                };

            } else {

                let sourceExamples = response.data.contextResults.results[0].sourceExamples;
                let targetExamples = response.data.contextResults.results[0].targetExamples;
    
                for (let i = 0; i < sourceExamples.length; i++) {
    
                    contextExamples.push({
                        from: sourceExamples[i].replace(/<[^>]*>/gi, ''),
                        to: targetExamples[i].replace(/<[^>]*>/gi, ''),
                        phrase_from: sourceExamples[i].match(/(?<=<em>)(.*?)(?=<\/em>)/gi)[0],
                        phrase_to: targetExamples[i].match(/(?<=<em>)(.*?)(?=<\/em>)/gi)[0],
                    });
                    
                }

                return {
                    text: text,
                    from: response.data.from,
                    to: response.data.to,
                    translation: response.data.translation,
                    context: {
                        examples: contextExamples,
                        rude: response.data.contextResults.results[0].rude
                    },
                    detected_language: response.data.languageDetection.detectedLanguage,
                    voice: (condition) ? `${urls.voice}voiceName=${lang[to.toLowerCase()] == 'eng' ? 'Heather' : 'Alyona'}22k?inputText=${textToVoice}` : false
                };

            }

        }).catch((err) => { throw new Error('reverso.net did not respond or there is no translation for the given text.\n' + err) });
    }

}

module.exports = Reverso;