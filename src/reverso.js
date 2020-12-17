const axios = require('axios');
const cheerio = require('cheerio');
const urls = require('./urls'); 
const { checkContextLang, checkSpellLang, checkSynonymsLang } = require('./langcheck');

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

        }).catch(() => { throw new Error('reverso.net did not respond or there are no context examples for the given text.') });
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
        }).catch(() => { throw new Error('reverso.net did not respond or your text has no mistakes.') });
    }

    /**
     * Retrieves synonymous of target text.
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
            const result = [];

            // thanks to https://stackoverflow.com/questions/32655076/cheerio-jquery-selectors-how-to-get-a-list-of-elements-in-nested-divs
            $('body').find(`a[class="synonym  relevant"]`).each((i, e) => {
                result.push({
                    id: i,
                    synonym: $(e).text()
                });
            });

            return result;
        }).catch(() => { throw new Error('reverso.net did not respond or there are no synonyms for the given text.') });
    }

}

module.exports = Reverso;