import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz.js";
import { MsgDelegate } from "@kyvejs/types/client/kyve/delegation/v1beta1/tx.js";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp.js";

export default () => Alpine.data('restake', () => ({
  amount: null,
  date: null,
  busyRestake: false,
  busyRevoke: false,
  validateDate(date) {
    if (Alpine.store('wallet').delegated !== null && Alpine.store('wallet').delegated <= 0) {
      return 'You must delegate tokens to validator first before they can restake for you'
    }
    if (!date) {
      return 'Please select a date'
    }
    if (new Date(date) < new Date()) {  
      return 'Please select a date in the future'
    }


    return false
  },
  restakeToolTip() {
    if (!Alpine.store('wallet').client?.account?.address) 
      return 'Please connect wallet'
    const isDateInvalid = this.validateDate(this.date)
    if (isDateInvalid)
      return isDateInvalid
    return null
  },
  async saveRestake(granteeAddress) {
    const client = Alpine.store('wallet').client
    if (client) {
      const unixDate = Math.floor(new Date(this.date).getTime() / 1000) 
      this.busyRestake = true 
      try {
        const grantDelegateRewards = {
          typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
          value: {
            granter: client.account.address,
            grantee: granteeAddress,
            grant: {
              authorization: {
                typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                value: GenericAuthorization.encode({
                  msg: '/kyve.delegation.v1beta1.MsgDelegate',
                  value: MsgDelegate.encode({
                    amount: '1000000',
                    staker: granteeAddress,
                    creator: client.account.address,
                  }).finish()
                }).finish()
              },
              expiration: Timestamp.fromPartial({
                seconds: unixDate,
                nanos: 0
              })
            },
          }
        }
        Notify.fire({
          icon: 'info',
          title: 'Broadcasting transaction',
          text: 'Please wait',
          showConfirmButton: false,
          timer: 20000,
          timerProgressBar: true,
        })
        const result = await client.nativeClient.signAndBroadcast(client.account.address, [grantDelegateRewards], 'auto');
        Notify.fire({
          icon: 'success',
          title: 'Sucess!',
          html: `Trascation sucessfully broadcasted: <a href="https://ping.pub/kyve/tx/${result.transactionHash}" target=”_blank”>${result.transactionHash}</a>`,
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = '/'
          }
        })
      } finally {
        this.busyRestake = false
      }
       
    }
  },
  async revokeRestake(grantAddress) {
    const client = Alpine.store('wallet').client;
    if (client) {
      this.busyRevoke = true;
      try {
        const revokeGrantDelegate = {
          typeUrl: '/cosmos.authz.v1beta1.MsgRevoke',
          value: {
            granter: client.account.address,
            grantee: grantAddress,
            msgTypeUrl: '/kyve.delegation.v1beta1.MsgDelegate',
          }
        };
        Notify.fire({
          icon: 'info',
          title: 'Broadcasting transaction',
          text: 'Please wait',
          showConfirmButton: false,
          timer: 20000,
          timerProgressBar: true,
        })
        const result = await client.nativeClient.signAndBroadcast(client.account.address, [revokeGrantDelegate], 'auto');
        Notify.fire({
          icon: 'success',
          title: 'Success!',
          html: `Trascation sucessfully broadcasted: <a href="https://ping.pub/kyve/tx/${result.transactionHash}" target=”_blank”>${result.transactionHash}</a>`,
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = "/"
          }
        })
      } finally {
        this.busyRevoke = false;
      }
    }  
  }
      
}))
