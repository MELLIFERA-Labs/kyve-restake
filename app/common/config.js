const { envSchema } = require('env-schema')
const schema = {
  type: 'object',
  required: [
    'GRANT_MNEMONIC',
    'VALIDATOR_ADDRESS',
    'VALIDATOR_IMAGE_URL',
    'HUMAN_READABLE_RESTAKE_BY_CRON',
    'RESTAKE_BY_CRON'
  ],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development'
    },
    PORT: {
      type: 'number',
      default: 5001
    },
    KYVE_ENV: {
      type: 'string',
      default: 'kyve-1'
    },
    REST: {
      type: 'string'
    },
    RPC: {
      type: 'string'
    },
    GRANT_MNEMONIC: {
      type: 'string'
    },
    VALIDATOR_ADDRESS: {
      type: 'string'
    },
    VALIDATOR_IMAGE_URL: {
      type: 'string'
    },
    RESTAKE_BY_CRON: {
      type: 'string'
    },
    HUMAN_READABLE_RESTAKE_BY_CRON: {
      type: 'string'
    }
  }
}

module.exports = envSchema({
  schema,
  dotenv: true
})
