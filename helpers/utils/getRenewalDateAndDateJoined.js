import moment from 'moment'
import {Firebase} from '../'

function getRenewalDateAndDateJoined(params, cb) {
  let {memberID, castID, frequency} = params

  Firebase.get(`castPayments/${castID}/${memberID}`, (res) => {
    if (!res) {
      cb({renewalDate: null, dateJoine: null})
      return
    }

    let timestamps = Object.keys(res)
    let latest = timestamps[timestamps.length - 1]

    let renewalDateUTC = moment.utc(parseInt(latest)).add(1, (frequency === 'WEEKLY') ? 'week' : 'month').valueOf()
    let renewalDate = moment(parseInt(latest)).add(1, (frequency === 'WEEKLY') ? 'week' : 'month').format("MMM D, YYYY")
    let dateJoinedUTC = moment.utc(parseInt(timestamps[0])).valueOf()
    let dateJoined = moment(parseInt(timestamps[0])).format("MMM D, YYYY")

    cb({renewalDate, dateJoined, renewalDateUTC, dateJoinedUTC})
  })
}

module.exports = getRenewalDateAndDateJoined
