const axios = require('axios');
const cheerio = require('cheerio');
const urls = require('./urls'); 
const { checkContextLang, checkSpellLang, checkSynonymsLang } = require('./langcheck');

class Reverso {
    /**
     * Looks for examples of using requested text in target language.
     * @public
     * @param {string} text a word or sentence that you need to know how to use in target language.
     * @param {string} srcLang a source language of the text. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     * @param {string} trgLang a target language of examples you need. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     */
    getContext(text, srcLang, trgLang) {
        checkContextLang(srcLang.toLowerCase(), trgLang.toLowerCase());

        let url = urls.contextUrl + srcLang.toLowerCase() + '-' + trgLang.toLowerCase() + '/' + encodeURIComponent(text);

        return axios.get(url).then((response) => {
            const $ = cheerio.load(response.data);
            let result = [];

            let srcLangExample = $('body').find('.example').find('div[class="src ltr"] > span[class="text"]').text().trim().split('\n');
            let trgLangExample = $('body').find('.example').find('div[class="trg ltr"] > span[class="text"]').text().trim().split('\n');

            for (let i = 0; i < srcLangExample.length; i++) {
                result.push({
                    id: i,
                    srcLang: srcLangExample[i].trimStart(),
                    trgLang: trgLangExample[i].trimStart()
                });
            }

            return result;
        }).catch((error) => { console.error('\nError: reverso.net did not respond or there are no context examples for the given text.\n') });
    }

    /**
     * Checks spelling of requested text.
     * @public
     * @param {string} text a word or sentence that you need to check.
     * @param {string} lang a source language of the text. Available languages: English and French.
     */
    getSpellCheck(text, lang) {
        checkSpellLang(lang.toLowerCase());
        
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
                    full_text: data.text,
                    type: data.corrections[i].type,
                    explanation: data.corrections[i].longDescription,
                    corrected: data.corrections[i].correctionText
                });
            }

            return result;
        }).catch((error) => { console.error('\nError: reverso.net did not respond or your text has no mistakes.\n') });
    }

    /**
     * Looks for synonyms of requested text.
     * @public
     * @param {string} text a word or phrase that you need to check.
     * @param {string} lang a source language of the text. Available languages: English, Russian, German, Spanish, French, Italian, Polish.
     */
    getSynonyms(text, lang) {
        checkSynonymsLang(lang.toLowerCase());

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
            $('body').find('button[class="copy-to-clipboard icon copy-for-context cursor-pointer"]').each((i, e) => {
                result.push({
                    id: i,
                    synonym: $(e).attr('data-word')
                });
            });

            return result;
        }).catch((error) => { console.error('\nError: reverso.net did not respond or there are no synonyms for the given text.\n') });
    }
}

module.exports = Reverso;