import moment from 'moment'
import {Firebase} from '../'

function getRenewalDateAndDateJoined(params, cb) {
  let {memberID, castID, frequency} = params

  Firebase.get(`castPayments/${castID}/${memberID}`, (res) => {
    let timestamps = Object.keys(res)
    let latest = timestamps[timestamps.length - 1]
    let renewalDate = moment(parseInt(latest)).add(1, (frequency === 'WEEKLY') ? 'week' : 'month').format("MMM D, YYYY")
    let dateJoined = moment(parseInt(timestamps[0])).format("MMM D, YYYY")
    cb({renewalDate, dateJoined})
  })
}

module.exports = getRenewalDateAndDateJoined
