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
    async connect(walletType, valAddress) {
      if (walletType === 'keplr') {
        this.client = await sdk.fromKeplr();
      } else if (walletType === 'leap') {
        this.client = await sdk.fromLeap();
      } else if (walletType === 'cosmostation') {
        this.client = await sdk.fromCosmostation()
      }
    
      this.apiClient = sdk.createLCDClient();

      localStorage.setItem("_connected", walletType);
      
      this.balance = await this.client.getKyveBalance();
      this.text = formatAddress(this.client.account.address)
      const response = await this.apiClient.kyve.query.v1beta1.stakersByDelegator({ delegator: this.client.account.address })
      const staker = response.stakers.find((st) => st.staker.address === valAddress)
      const cosmosAPI = cosmosApi(this.client.config.rest)
      this.delegated = staker?.delegation_amount ?? 0;
      this.rewards = staker?.current_reward ?? 0;
      const result = await cosmosAPI.getPermissionsByGranterAndGrantee(this.client.account.address, dataValidator.dataset.grantAddress, '/kyve.delegation.v1beta1.MsgDelegate').catch(error => {
        return false;
      })
      console.log(result.grants)
      this.restakeData = {
        isAlive: result?.grants ? new Date(result.grants[0].expiration).getTime() >= Date.now() : undefined,
        expiration: result?.grants ? result.grants[0].expiration : undefined
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
