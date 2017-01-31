import moment from 'moment'

function parsePaymentDetails(props) {
  let { payment, currentUser } = props
  
  let isOutgoingPayment = payment.sender_id === currentUser.uid

  let user = {
    name: (isOutgoingPayment) ? payment.recip_name : payment.sender_name,
    username: (isOutgoingPayment) ? payment.recip_username : payment.sender_username,
    pic: (isOutgoingPayment) ? payment.recip_pic : payment.sender_pic
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
    incoming: !isOutgoingPayment
  }

  return details
}

module.exports = parsePaymentDetails
