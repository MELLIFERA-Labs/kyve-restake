const { DateTime } = require('luxon')
function msgTimeAgo (isoDate) {
  const currentTime = DateTime.now()
  const date = DateTime.fromISO(isoDate)
  const diff = currentTime.diff(date)
  const duration = diff.shiftTo('years', 'months', 'days', 'hours', 'minutes', 'seconds')
  const { years, months, days, hours, minutes, seconds } = duration

  let message = ''
  if (years > 0) {
    message = `${years} year${years !== 1 ? 's' : ''} ago`
  } else if (months > 0) {
    message = `${months} month${months !== 1 ? 's' : ''} ago`
  } else if (days > 0) {
    message = `${days} day${days !== 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    message = `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    message = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else {
    message = `${seconds} second${seconds !== 1 ? 's' : ''} ago`
  }
  return message
}

function runAsyncWrapper (callback) {
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next)
  }
}

module.exports = {
  msgTimeAgo,
  runAsyncWrapper
}
