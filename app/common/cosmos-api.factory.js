const { fetch } = require('undici')
const CosmosApi = require('./depends-free/cosmos-api')

module.exports = (function () {
  let apiInstance = null
  return {
    init (baseUrl) {
      apiInstance = CosmosApi(baseUrl, fetch)
    },
    get api () {
      if (!apiInstance) throw new Error('API not initialized')
      return apiInstance
    }
  }
})()
