import moment from 'moment'

function getRenewalDate(params) {
  let {createdAt, freq} = params
  let step = (freq === "MONTHLY") ? "months" : "weeks"
  let renewalDate = moment(createdAt).add()
  let now = Date.now()
  let elapsed = now - createdAt

  console.log("--> getRenewalDate was invoked...")
  console.log("--> createdAt", createdAt)
  console.log("--> freq", freq)
  console.log("--> elapsed", elapsed)

  return createdAt
}

module.exports = getRenewalDate
