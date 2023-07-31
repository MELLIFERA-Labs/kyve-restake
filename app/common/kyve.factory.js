const KyveSDK = require('@kyvejs/sdk').default

function kyveSDK () {
  let kyve = null
  async function init (mnemonic, env) {
    const sdk = new KyveSDK(env)
    kyve = {
      kyveSdk: await sdk.fromMnemonic(mnemonic),
      kyveApi: sdk.createLCDClient(env)
    }
  }
  return {
    init,
    get instance () {
      if (!kyve) {
        throw new Error('kyveSDK not initialized')
      }
      return kyve
    }
  }
}
module.exports = kyveSDK()
