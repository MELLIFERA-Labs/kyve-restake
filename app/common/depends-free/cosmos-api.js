module.exports = function CosmosApi (baseUrl, reqFetch = fetch) {
  const makeRequest = (subUrl, queryParams = null) => {
    const filteredObject = queryParams && Object.keys(queryParams).reduce((acc, key) => {
      if (queryParams[key] !== undefined) {
        acc[key] = queryParams[key]
      }
      return acc
    }, {})
    const url = new URL(subUrl, baseUrl)
    const urlToReq = filteredObject ? `${url}?${new URLSearchParams({ ...filteredObject })}` : url
    return reqFetch(urlToReq).then(res => res.json())
  }
  return {
    getPermissionsByGranterAndGrantee: (granter, grantee, msgTypeUrl) => makeRequest('/cosmos/authz/v1beta1/grants', { grantee, granter, msg_type_url: msgTypeUrl }),
    findSendedTrx: (address) => makeRequest('/cosmos/tx/v1beta1/txs', { order_by: '2', events: `message.sender='${address}'` }),
    getPermissionsByGrantee: (granteeAddress) => makeRequest(`/cosmos/authz/v1beta1/grants/grantee/${granteeAddress}`)
  }
}
