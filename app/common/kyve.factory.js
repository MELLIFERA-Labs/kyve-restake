const KyveSDK = require('@kyvejs/sdk').default

function kyveSDK () {
  let kyve = null
  async function init (mnemonic, env = { chainId: 'kyve-1' }) {
    const sdk = env.rpc || env.api ? new KyveSDK(env.chainId, { rpc: env.rpc, api: env.api }) : new KyveSDK(env.chainId)
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
