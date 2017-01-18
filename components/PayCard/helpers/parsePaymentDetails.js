import moment from 'moment'

function parsePaymentDetails(props) {
  let { payment, currentUser } = props

  console.log("--> parsePaymentDetails was invoked with props", props)

  let user = {
    name: (payment.flow == "in") ? payment.sender_name : payment.recip_name,
    username: (payment.flow == "in") ? payment.sender_username : payment.recip_username,
    pic: (payment.flow == "in") ? payment.sender_pic : payment.recip_pic
  }

  let frequency = payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1).toLowerCase()
  let timestamp = parseInt(payment.nextPayment)
  let formattedTimestamp = moment(timestamp).format("MMM D")
  let next = (formattedTimestamp !== "Invalid date") ? formattedTimestamp : "TBD"

  let details = {
    pic: user.pic,
    name: user.name,
    username: user.username,
    purpose: payment.purpose,
    amount: payment.amount,
    frequency: frequency,
    nextTimestamp: payment.nextPayment,
    next: next,
    status: payment.status,
    payments: payment.payments,
    paymentsMade: payment.paymentsMade,
    pid: payment.pid,
    token: currentUser.token,
    paymentType: payment.type,
    incoming: payment.flow === "in"
  }

  console.log("--> returning details", details)

  return details
}

module.exports = parsePaymentDetails
