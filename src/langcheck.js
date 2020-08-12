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
    if (counter === 2) {
        return true;
    } else {
        throw new TypeError('Unsupported langauge. Supported langauges: English, Russian, German, Spanish, French, Italian, Polish.');
    }
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
    if (counter === 1) {
        return true;
    } else {
        throw new TypeError('Unsupported langauge. Supported langauges: English, Russian, German, Spanish, French, Italian, Polish.');
    }
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
    if (counter === 1) {
        return true;
    } else {
        throw new TypeError('Unsupported langauge. Supported langauges: English, Russian, German, Spanish, French, Italian, Polish.');
    }
}

module.exports = { forContext, forSpellCheck, forSynonyms };