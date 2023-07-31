const pino = require('pino')
module.exports = function (name) {
  if (process.env.NODE_ENV === 'development') {
    return pino({ name, transport: { target: 'pino-pretty' } })
  }
  return pino({ name })
}
