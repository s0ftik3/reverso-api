const contextLangs = require('./langs/context');
const spellLangs = require('./langs/spell');

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 * @param {string} b Second language.
 */
function checkContextLang(a, b) {

    if (typeof(a) === 'string' && typeof(b) === 'string') {
        true;
    } else {
        throw new Error('getContext: values must be strings.');
    }

    a = a.toLowerCase();
    b = b.toLowerCase();
    let counter = 0;
    if (a && b) {
        for (let i = 0; i < contextLangs.length; i++) {
            if (a.includes(contextLangs[i]) || b.includes(contextLangs[i])) {
                counter++
            }
        }
    }
    
    if (counter === 2) {
        return true;
    } else {
        throw new Error('getContext: Unsupported langauge. Supported langauges: English, Russian, German, Spanish, French, Italian, Polish.');
    }

}

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 */
function checkSpellLang(a) {

    if (typeof(a) === 'string') {
        true;
    } else {
        throw new Error('getSpellCheck: values must be strings.');
    }

    a = a.toLowerCase();
    let counter = 0;
    if (a) {
        for (let i = 0; i < spellLangs.length; i++) {
            if (a.includes(spellLangs[i])) {
                    counter++
            }
        }   
    }

    if (counter === 1) {
        return true;
    } else {
        throw new Error('getSpellCheck: Unsupported langauge. Supported langauges: English and French.');
    }

}

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 */
function checkSynonymsLang(a) {

    if (typeof(a) === 'string') {
        true;
    } else {
        throw new Error('getSynonyms: values must be strings.');
    }

    a = a.toLowerCase();
    let counter = 0;
    if (a) {
        for (let i = 0; i < contextLangs.length; i++) {
            if (a.includes(contextLangs[i])) {
                    counter++
            }
        }   
    }

    if (counter === 1) {
        return true;
    } else {
        throw new Error('getSynonyms: Unsupported langauge. Supported langauges: English, Russian, German, Spanish, French, Italian, Polish.');
    }

}

module.exports = { checkContextLang, checkSpellLang, checkSynonymsLang };