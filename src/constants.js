/*
 * Unofficial Reverso API (promise-based).
 * The API allows you to manipulate with your text in different ways.
 * Almost all the features from the website are supported by this API.
 * Currently supported: context, translation, spell check, synonyms.
 * 
 * Source: reverso.net
 * Author: github.com/s0ftik3
 */

module.exports = {
    "CONTEXT_URL"     : "https://context.reverso.net/translation/",
    "SPELLCHECK_URL"  : "https://orthographe.reverso.net/api/v1/Spelling",
    "SYNONYMS_URL"    : "https://synonyms.reverso.net/synonym/",
    "TRANSLATION_URL" : "https://api.reverso.net/translate/v1/translation",
    "VOICE_URL"       : "https://voice.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/"
};