const DECIMAL = 6
const formatNumber = (amount) => {
  if (amount) {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`
  }
  return '0'
}
const toHumamReadable = (amount) => {
  if (amount) {
    return (Number(BigInt(amount) * BigInt(100) / BigInt(10 ** DECIMAL)) / 100).toFixed(2).toString()
  }

  return '0'
}
const formatProcent = (procent) => {
  const formatProcent = procent * 100
  return formatProcent.toFixed(2).toString()
}
const formatAddress = (address) => {
  if (!address) {
    return '-'
  }

  if (address) {
    return `${address.slice(0, 10)}...${address.slice(address.length - 6)}`
  }
}
module.exports = {
  formatNumber,
  toHumamReadable,
  formatProcent,
  formatAddress
}
