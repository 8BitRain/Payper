import moment from 'moment'
import {Firebase} from '../'

function getRenewalDateAndDateJoined(params, cb) {
  let {memberID, castID, frequency} = params

  Firebase.get(`castPayments/${castID}/${memberID}`, (res) => {
    if (!res) {
      cb({renewalDate: null, dateJoine: null})
      return
    }

    let transactions = Object.keys(res)
    let firstTimestamp = res[transactions[0]].time
    let latestTimestamp = res[transactions[transactions.length - 1]].time

    let renewalDateUTC = moment.utc(parseInt(latestTimestamp)).add(1, (frequency === 'WEEKLY') ? 'week' : 'month').valueOf()
    let renewalDate = moment(parseInt(latestTimestamp)).add(1, (frequency === 'WEEKLY') ? 'week' : 'month').format("MMM D, YYYY")
    // let renewalDateUTC = moment.utc(parseInt(latestTimestamp)).valueOf()
    // let renewalDate = moment(parseInt(latestTimestamp)).format("MMM D, YYYY")
    let dateJoinedUTC = moment.utc(parseInt(firstTimestamp)).valueOf()
    let dateJoined = moment(parseInt(firstTimestamp)).format("MMM D, YYYY")

    cb({renewalDate, dateJoined, renewalDateUTC, dateJoinedUTC})
  })
}

module.exports = getRenewalDateAndDateJoined
