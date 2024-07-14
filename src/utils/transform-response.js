/**
 * @param response
 * @returns {Promise<*>}
 */
async function transformResponse(response) {
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
        data = await response.json()
    } else {
        data = await response.text()
    }

    return data
}

module.exports = transformResponse
