import moment from 'moment'

function formatBroadcastTimestamp(utc) {
  let then = moment(utc)
  let timeToNow = then.toNow(true)
  let suffix

  if (timeToNow.indexOf('seconds') >= 0)
    timeToNow = "< 1m"
  else if (timeToNow.indexOf('minute') >= 0)
    suffix = "m"
  else if (timeToNow.indexOf('hour') >= 0)
    suffix = "h"
  else if (timeToNow.indexOf('day') >= 0)
    suffix = "d"
  else if (timeToNow.indexOf('month') >= 0)
    suffix = "m"
  else if (timeToNow.indexOf('year') >= 0)
    suffix = "y"

  if (suffix) {
    timeToNow = timeToNow.split(" ")[0].concat(suffix)
  }

  if (timeToNow.charAt(0) === 'a') {
    let charBuffer = timeToNow.split("")
    charBuffer[0] = "1"
    timeToNow = charBuffer.join("")
  }

  return timeToNow
}

module.exports = formatBroadcastTimestamp
