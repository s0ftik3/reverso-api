const axios = require('axios');
const cheerio = require('cheerio');
const urls = require('./urls'); 
const contextLangs = require('./langs/context');
const spellLangs = require('./langs/spell');

class Reverso {
    contextUrl = urls.contextUrl;
    spellCheckUrl = urls.spellCheckUrl;

    /**
     * Checks language support.
     * @public
     * @param {string} a first language.
     * @param {string} b second language (if needed).
     */
    langChecker(a, b) {
        let counter = 0;
        if (a && b) {
            for (let i = 0; i < contextLangs.length; i++) {
                if (a.includes(contextLangs[i]) || b.includes(contextLangs[i])) {
                    counter++
                }
            }
        } else {
            for (let i = 0; i < spellLangs.length; i++) {
                if (a.includes(spellLangs[i])) {
                    counter++
                }
            }   
        }
        return counter;
    }

    /**
     * Looks for examples of using requested text in target language.
     * @public
     * @param {string} text word or sentence that you need to know how to use in target language.
     * @param {string} srcLang source language of the text. Available languages: English, Russian, German.
     * @param {string} trgLang target language of examples you need. Available languages: English, Russian, German.
     */
    findContext(text, srcLang, trgLang) {
        let url = this.contextUrl + srcLang.toLowerCase() + '-' + trgLang.toLowerCase() + '/' + encodeURIComponent(text);

        if (this.langChecker(srcLang.toLowerCase(), trgLang.toLowerCase()) !== 2) {
            throw new TypeError('Unsupported langauge. Supported langauges: English, Russian, German.');
        }

        return axios.get(url).then((response) => {
            const $ = cheerio.load(response.data);
            let result = [];

            let srcLangExample = $('body').find('.example').find('div[class="src ltr"] > span[class="text"]').text().trim().split('\n');
            let trgLangExample = $('body').find('.example').find('div[class="trg ltr"] > span[class="text"]').text().trim().split('\n');

            for (let i = 0; i < srcLangExample.length; i++) {
                result.push({
                    srcLang: srcLangExample[i].trimStart(),
                    trgLang: trgLangExample[i].trimStart()
                });
            }

            return result;
        }).catch((error) => { console.log(error) });
    }

    /**
     * Checks spelling of requested text.
     * @public
     * @param {string} text word or sentence that you need to check.
     * @param {string} srcLang source language of the text. Available languages: English or French.
     */
    spellCheck(text, srcLang) {
        if (this.langChecker(srcLang.toLowerCase()) !== 1) {
            throw new TypeError('Unsupported langauge. Supported langauges: English, French.');
        }
        
        let resLang = {
            'english': 'eng',
            'french': 'fra'
        };
        let url = this.spellCheckUrl + `?text=${encodeURIComponent(text)}&language=${resLang[srcLang.toLowerCase()]}&getCorrectionDetails=true`;

        return axios.get(url).then((response) => {
            let data = response.data;
            let result = [];

            for (let i = 0; i < data.corrections.length; i++) {
                result.push({
                    corrected: data.text,
                    type: data.corrections[i].type,
                    longDescription: data.corrections[i].longDescription,
                    correctionText: data.corrections[i].correctionText
                });
            }

            return result;
        }).catch((error) => { console.log(error) });
    }
}

module.exports = Reverso;