/**
 * @param str
 * @returns {string}
 */
function toBase64(str) {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(str).toString('base64')
    } else {
        return btoa(String.fromCharCode(...new TextEncoder().encode((str))))
    }
}

module.exports = toBase64
