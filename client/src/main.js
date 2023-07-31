import Alpine from 'alpinejs';
import { formatNumber, toHumamReadable, formatAddress as _formatAddress } from '../../app/common/depends-free/common-utils';
import walletInit from './wallet'
import delegationInit from './delegation'
import restakeInit from './restake'

/** setup global **/
window.formatNumber = formatNumber;
window.toHumamReadable = toHumamReadable;
window.formatAddress = _formatAddress;
window.Alpine = Alpine
// console.log = () => {}

/** end setup global **/


document.addEventListener("readystatechange", () => {
  window.onerror = function (event, souce, lineno, colon, error) { 
    console.error(error)
    Notify.fire({
      icon: 'error',
      title: 'Error!',
      text: error.message,
    })
  }
  const dataValidator = document.querySelector("body");
  window.Notify = Swal.mixin({
    icon: 'error',
    toast: true,
    position: 'bottom-end',
    customClass: {
      popup: 'colored-toast'
    },
  })
  // init component
  walletInit(dataValidator);
  delegationInit();
  restakeInit();

  const isConnected = localStorage.getItem("_connected")
  if (isConnected) {
    Alpine.store('wallet').connect(dataValidator.dataset.validatorAddress)
  }

  Alpine.start()
})



