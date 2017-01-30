export function generatePayments(params, cb) {
  console.log("--> generatePayment was invoked with params\n", params)

  let {paymentOnboardingState, currentUser} = params

  let payments = []

  for (var i = 0; i < paymentOnboardingState.who.length; i++) {
    let curr = paymentOnboardingState.who[i]
    let pid = generatePID()
    let payment = formatPaymentOnboardingState({
      state: paymentOnboardingState,
      paymentType: paymentOnboardingState.confirming,
      currentUser: currentUser,
      otherUser: curr
    })
    let paymentStatus = generatePaymentStatus({
      paymentType: paymentOnboardingState.confirming,
      senderID: payment.sender_id,
      recipID: payment.recip_id
    }, (status) => {
      payment.status = status
      payments.push(payment)
      console.log(payments)
    })
  }
}

export function generatePID() {
  let buffer = []
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 8; i++)
    buffer.push(possible.charAt(Math.floor(Math.random() * possible.length)))
  return buffer.join('')
}

export function generatePaymentStatus(params, cb) {
  // TODO: Make necessary Firebase reads & determine payment status
  //       (build from Vash's code)
  let {paymentType, senderID, recipID} = params
  cb("active")
}

export function formatPaymentOnboardingState(params) {
  let {state, paymentType, currentUser, otherUser} = params

  let sender = {
    sender_id: (paymentType === "request") ? otherUser.uid : currentUser.uid,
    sender_name: (paymentType === "request") ? `${otherUser.first_name} ${otherUser.last_name}` : `${currentUser.first_name} ${currentUser.last_name}`,
    sender_username: (paymentType === "request") ? otherUser.username : currentUser.username,
    sender_pic: (paymentType === "request") ? otherUser.profile_pic : currentUser.profile_pic
  }

  let recip = {
    recip_id: (paymentType === "pay") ? otherUser.uid : currentUser.uid,
    recip_name: (paymentType === "pay") ? `${otherUser.first_name} ${otherUser.last_name}` : `${currentUser.first_name} ${currentUser.last_name}`,
    recip_username: (paymentType === "pay") ? otherUser.username : currentUser.username,
    recip_pic: (paymentType === "pay") ? otherUser.profile_pic : currentUser.profile_pic
  }

  return Object.assign({}, sender, recip)
}
