import BigNumber from 'bignumber.js';

export default () => Alpine.data('delegation', (valAddress) => ({
  busy: false,
  amount: 0,
  async delegate(amount) {
    const client = Alpine.store('wallet').client;
    if (client) {
      this.busy = true;
      try {
        const realAmount = BigNumber(amount).times(10 ** 6).toString()
        const result = await client.kyve.delegation.v1beta1.delegate({ amount: realAmount, staker: valAddress })
        Notify.fire({
          icon: 'info',
          title: 'Broadcasting transaction',
          text: 'Please wait',
          showConfirmButton: false,
          timer: 20000,
          timerProgressBar: true,
        })  
        const a = await result.execute().finally((data) => {
          this.busy = false
        }) 
        
        Notify.fire({
          icon: 'success',
          title: 'Sucess!',
          html: `Trascation sucessfully broadcast: <a href="https://ping.pub/kyve/tx/${result.txHash}" target=”_blank”>${result.txHash}</a>`,
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = "/"
          }
        })
      } finally {
        this.busy = false;
      }
    }
  }
}))
