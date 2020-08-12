const contextLangs = require('./langs/context');
const spellLangs = require('./langs/spell');

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 * @param {string} b Second language.
 */
function checkContextLang(a, b) {
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
        return console.error('\ngetContext: Unsupported langauge. Supported langauges: English, Russian, German, Spanish, French, Italian, Polish.\n');
    }
}

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 */
function checkSpellLang(a) {
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
        return console.error('\ngetSpellCheck: Unsupported langauge. Supported langauges: English and French.\n');
    }
}

/**
 * Checks language support.
 * @public
 * @param {string} a First language.
 */
function checkSynonymsLang(a) {
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
        return console.error('\ngetSynonyms: Unsupported langauge. Supported langauges: English, Russian, German, Spanish, French, Italian, Polish.\n');
    }
}

module.exports = { checkContextLang, checkSpellLang, checkSynonymsLang };