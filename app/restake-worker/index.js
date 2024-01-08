const { MsgDelegate } = require('@kyvejs/types/client/kyve/delegation/v1beta1/tx.js')
const kyve = require('./../common/kyve.factory')
const cosmosApi = require('../common/cosmos-api.factory')
const config = require('../common/config')
const logger = require('../common/logger')
const log = logger('restake-worker')
const BigNumber = require('bignumber.js')
const CronJob = require('cron').CronJob

const restakeHandler = async () => {
  const permissions = await cosmosApi.api.getPermissionsByGrantee(kyve.instance.kyveSdk.account.address)
  const grantsWithRewards = await Promise.all(permissions.grants.filter((grant) => {
    return new Date(grant.expiration).getTime() > Date.now() && grant.authorization.msg === '/kyve.delegation.v1beta1.MsgDelegate'
  }).map(async (grant) => {
    const accountAssets = await kyve.instance.kyveApi.kyve.query.v1beta1.accountAssets({ address: grant.granter })
    return {
      accountAssets,
      ...grant
    }
  }))
  const delegateTrxs = grantsWithRewards.map((grant) => {
    return {
      typeUrl: '/cosmos.authz.v1beta1.MsgExec',
      value: {
        grantee: kyve.instance.kyveSdk.account.address,
        msgs: [
          {
            typeUrl: '/kyve.delegation.v1beta1.MsgDelegate',
            value: grant?.accountAssets?.protocol_rewards !== '0'
              ? MsgDelegate.encode(MsgDelegate.fromPartial({
                creator: grant.granter,
                staker: config.VALIDATOR_ADDRESS,
                amount: BigNumber(grant.accountAssets.protocol_rewards).gt(BigNumber(grant.accountAssets.balance)) ? grant.accountAssets.balance : grant.accountAssets.protocol_rewards
              })).finish()
              : null
          }
        ]
      }
    }
  }).filter((trx) => trx.value.msgs[0].value)

  const memo = `KYVE RESTAKE(MELLIFERA): VALIDATOR_ADDRESS: ${config.VALIDATOR_ADDRESS}`
  if (delegateTrxs.length) {
    const result = await kyve.instance.kyveSdk.nativeClient.signAndBroadcast(kyve.instance.kyveSdk.account.address, delegateTrxs, 'auto', memo)
    log.info('restake success', result)
  } else {
    log.info('no restake found')
  }
}

(async () => {
  await kyve.init(config.GRANT_MNEMONIC, {
    chaindId: config.KYVE_ENV,
    rpc: config.RPC,
    rest: config.REST
  })
  log.info(`Kyve SDK initialized with grantee: ${kyve.instance.kyveSdk.account.address} `)
  cosmosApi.init(kyve.instance.kyveSdk.config.rest)
  log.info('cosmos api initialized')
  const cron = new CronJob(
    config.RESTAKE_BY_CRON,
    restakeHandler,
    null,
    false)

  cron.start()
  log.info('resake script started')
})()
