import moment from 'moment'

function parsePaymentDetails(props) {
  let { payment, currentUser } = props

  let user = {
    name: (payment.flow == "incoming") ? payment.sender_name : payment.recip_name,
    username: (payment.flow == "incoming") ? payment.sender_username : payment.recip_username,
    pic: (payment.flow == "incoming") ? payment.sender_pic : payment.recip_pic
  }

  let frequency = payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1).toLowerCase()
  let formattedTimestamp = moment(payment.nextPayment).format("MMM D")
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
    incoming: payment.flow === "incoming",
    status: payment.status,
    payments: payment.payments,
    paymentsMade: payment.paymentsMade,
    pid: payment.pid,
    token: currentUser.token,
    paymentType: payment.type
  }

  return details
}

module.exports = parsePaymentDetails