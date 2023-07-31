const commander = require('commander')
const logger = require('../common/logger')
const log = logger('CLI')
const program = new commander.Command('KYVE RESTAKE CLI')
program
  .command('server')
  .description('Run a restake server')
  .action(() => {
    log.info('Restake server starting...')
    require('../server/src/server.js')
  })

program
  .command('worker')
  .description('Run a restake worker')
  .action(() => {
    log.info('Restake worker starting...')
    require('../restake-worker/index.js')
  })

program.parse()
