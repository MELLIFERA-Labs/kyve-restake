import cosmosApi from '../../app/common/depends-free/cosmos-api';
import { parseDateLeft } from './helpers'
import KyveSDK from '@kyvejs/sdk';
const sdk = new KyveSDK('kyve-1');

export default (dataValidator) => Alpine.store('wallet', {
    text: 'Connect Wallet',
    client: null,
    apiClient: null,
    balance: null,
    delegated: null,
    rewards: null,
    restakeData: {
      isAlive: null,
      expiration: null
    },
    async connect(valAddress) {
      
      this.client = await sdk.fromKeplr()
      this.apiClient = sdk.createLCDClient()

      localStorage.setItem("_connected", "true");
      this.balance = await this.client.getKyveBalance();
      this.text = formatAddress(this.client.account.address, 'test')
      const response = await this.apiClient.kyve.query.v1beta1.stakersByDelegator({ delegator: this.client.account.address })
      const staker = response.stakers.find((st) => st.staker.address === valAddress)
      const cosmosAPI = cosmosApi(this.client.config.rest)
      this.delegated = staker?.delegation_amount ?? 0;
      this.rewards = staker?.current_reward ?? 0;
      const result = await cosmosAPI.getPermissionsByGranterAndGrantee(this.client.account.address, dataValidator.dataset.grantAddress, '/kyve.delegation.v1beta1.MsgDelegate').catch(error => {
        return false;
      })
      this.restakeData = {
        isAlive: result && result.grants[0] && new Date(result.grants[0].expiration).getTime() >= Date.now(),
        expiration: result && result.grants[0] && result.grants[0].expiration,
      }
      sdk.onAccountChange(async () => {
        this.clearState()
        location.reload()
      })
    },
    disconnect() {
      this.clearState()
      localStorage.removeItem("_connected");
    },
    restakeExpireAfter() {
      if (!this.restakeData.expiration) 
        return {
           message: null,
           type: null
        }
      const parsedDate = parseDateLeft(this.restakeData.expiration);
      if(parsedDate.type === 'hours' || (parsedDate.type === 'days' && parsedDate.value <= 7)) {
        return {
          message:  `(${parsedDate.message})`,
          type: 'warning'
        }
      }
      return {
        message: `(${parseDateLeft(this.restakeData.expiration).message})`,
        type: 'ok'
      }
    },
    clearState() {
      this.text = 'Connect Wallet'
      this.client = null;
      this.apiClient = null;
      this.balance = null;
      this.delegated = null;
      this.rewards = null;
      this.restakeData = {
        isAlive: null,
        expiration: null
      }
    }
  })
