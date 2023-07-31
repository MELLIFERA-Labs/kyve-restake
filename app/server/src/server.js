const express = require('express')
const logger = require('../../common/logger')
const config = require('../../common/config')
const path = require('path')
const kyve = require('../../common/kyve.factory')
const commonUtils = require('../../common/depends-free/common-utils')
const cosmosApi = require('../../common/cosmos-api.factory')
const httpLogger = require('pino-http')
const { msgTimeAgo, runAsyncWrapper } = require('./helpers')
const log = logger('server')
const app = express()

app.set('trust proxy', 'loopback')
app.use(httpLogger({
  quietReqLogger: true,
  transport: {
    target: 'pino-http-print',
    options: {
      destination: 1,
      all: true,
      translateTime: true
    }
  }
}))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../views'))
app.use('/static', express.static(path.join(__dirname, '../assets')))

const getMainData = async () => {
  const result1 = await cosmosApi.api.findSendedTrx(kyve.instance.kyveSdk.account.address)
  const findLastRestakeTrx = result1?.tx_responses?.find((tx) => {
    return tx.tx.body.memo.includes('KYVE RESTAKE(MELLIFERA)')
  })
  const result = await kyve.instance.kyveApi.kyve.query.v1beta1.staker({ address: config.VALIDATOR_ADDRESS })
  const data = {
    validatorImageURL: config.VALIDATOR_IMAGE_URL,
    lastRestake: findLastRestakeTrx ? msgTimeAgo(findLastRestakeTrx.timestamp) : 'Long time ago',
    restakeEvery: config.HUMAN_READABLE_RESTAKE_BY_CRON,
    validatorMetadata: result.staker.metadata,
    validatorAddress: config.VALIDATOR_ADDRESS,
    grantAddress: kyve.instance.kyveSdk.account.address,
    commission: commonUtils.formatProcent(result.staker.metadata.commission),
    self_delegation: commonUtils.formatNumber(commonUtils.toHumamReadable(result.staker.self_delegation)),
    total_delegation: commonUtils.formatNumber(commonUtils.toHumamReadable(result.staker.total_delegation)),
    delegator_count: result.staker.delegator_count
  }
  return data
}

app.get('/', runAsyncWrapper(async (req, res) => {
  if (req.headers['hx-trigger'] === 'back') {
    return res.render('components/options')
  }
  res.render('index', await getMainData())
}))

app.get('/delegate', runAsyncWrapper(async (req, res) => {
  if (req.headers['hx-trigger'] === 'delegate') {
    return res.render('components/form-delegate', await getMainData())
  }
  return res.render('delegate', await getMainData())
}))
app.get('/restake', runAsyncWrapper(async (req, res) => {
  if (req.headers['hx-trigger'] === 'restake') {
    return res.render('components/form-restake', await getMainData())
  }
  return res.render('restake', await getMainData())
}))

app.get('/how-kyve-restake-works', runAsyncWrapper(async (_req, res) => {
  return res.render('how-restake-works', await getMainData())
}))

app.use(function (_, res) {
  return res.status(404).render('404')
})

app.use((err, _req, res, _next) => {
  log.error(err)
  res.status(500).render('error')
});

(async () => {
  await kyve.init(config.GRANT_MNEMONIC)
  log.info(`Kyve SDK initialized with grantee: ${kyve.instance.kyveSdk.account.address} `)
  cosmosApi.init(kyve.instance.kyveSdk.config.rest)
  log.info('Cosmos API initialized')

  app.listen(config.PORT, () => {
    log.info(`Server listening on port ${config.PORT}`)
  })
})().catch((err) => {
  log.error(err)
  process.exit(1)
})
