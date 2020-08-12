const contextLangs = require('./langs/context');
const spellLangs = require('./langs/spell');

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 * @param {string} b Second language.
 */
function forContext(a, b) {
    let counter = 0;
    if (a && b) {
        for (let i = 0; i < contextLangs.length; i++) {
            if (a.includes(contextLangs[i]) || b.includes(contextLangs[i])) {
                counter++
            }
        }
    }
    return counter;
}

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 */
function forSpellCheck(a) {
    let counter = 0;
    if (a) {
        for (let i = 0; i < spellLangs.length; i++) {
            if (a.includes(spellLangs[i])) {
                    counter++
            }
        }   
    }
    return counter;
}

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 */
function forSynonyms(a) {
    let counter = 0;
    if (a) {
        for (let i = 0; i < contextLangs.length; i++) {
            if (a.includes(contextLangs[i])) {
                    counter++
            }
        }   
    }
    return counter;
}

module.exports = { forContext, forSpellCheck, forSynonyms };