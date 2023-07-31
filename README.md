# [KyveRestake](https://kyve-restake.mellifera.network)

Open source restake service for Kyve protocol nodes. 

Allows delegators to grant permission for a validator to compound their rewards.

Inspired by [REStake](https://github.com/eco-stake/restake) restake service, which do the same but for cosmos nodes

Build with [@kyvejs/sdk](https://github.com/KYVENetwork/kyvejs/tree/main/common/sdk)

## Installation
env file example
```env
# Generate a new hot wallet you will use to automatically carry out the staking transactions. The mnemonic will need to be provided to the app so use a dedicated wallet and only keep enough funds for transaction fees
GRANT_MNEMONIC=menemonic seed phrase with minimal funds for fee payment. This wallet will be used to pay for the transactions fee and restake delegators rewards
#Setup your validator address 
VALIDATOR_ADDRESS=kyve1dsk7wfy6n2ylwj8x2el6txgsyff8av6wa5yl28
#Setup image url for your validator address
VALIDATOR_IMAGE_URL=https://s3.amazonaws.com/keybase_processed_uploads/e86fec4890dc435ba14cb684ab658e05_360_360.jpg
# CRON job for automatically restaking tokens
RESTAKE_BY_CRON='0 */4 * * *'
# Human-readable CRON job for automatically restaking tokens
HUMAN_READABLE_RESTAKE_BY_CRON='4 hours'
```
1. With Docker compose

You need docker installed 
```yaml
version: '3'
services:
  server:
    image: mellifera/kyve-restake
    restart: unless-stopped  
    ports:
      - 5000:5000
    command: node cli/index.js server 
    env_file:
      - <path to .env file>
  worker:
    image: mellifera/kyve-restake
    restart: unless-stopped  
    command: node cli/index.js worker 
    env_file:
      - <path to .env file>
```
2. From source code

You need nodejs 20+ installed.

Add `.env` file to `app` directory or set env variables in your system

```bash
git clone <repo url> kyve-restake
cd kyve-restake/client
npm i 
npm run build 

cd ../app
npm i

# run server 
node cli/index.js server
# run restake worker
node cli/index.js worker
```

## FAQ. 
 1. Why there is no limit for delegate grant (delegate address restriction, max delegate funds)?

  - We use GenericAuthorization for message `/kyve.delegation.v1beta1.MsgDelegate`. To implement more restrictions for grants needs a custom `Authorization` by analogy [StakeAuthorization](https://docs.cosmos.network/main/modules/authz#stakeauthorization) on chain side.
    After this will be implemented on chain side, we will add it to our service.

 2. Can I run KyveRestake service for my protocol node? 

  - Of course, you can run it for your validator. Just leave references of creators of this service :)


## You want to get involved? 😍

Please submit a pull request or open an issue ❤️
