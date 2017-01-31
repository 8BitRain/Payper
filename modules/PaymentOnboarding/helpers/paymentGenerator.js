import firebase from 'firebase'

export function generatePayments(params, cb) {
  let {paymentOnboardingState, currentUser} = params
  let payments = {}

  for (var i = 0; i < paymentOnboardingState.who.length; i++) {
    const INDEX = i
    let curr = paymentOnboardingState.who[INDEX]
    let pid = generatePID()

    let payment = formatPaymentOnboardingState({
      pid,
      state: paymentOnboardingState,
      paymentType: paymentOnboardingState.confirming,
      currentUser: currentUser,
      otherUser: curr
    })

    let paymentStatus = generatePaymentStatus({
      currentUser,
      paymentType: paymentOnboardingState.confirming,
      senderID: payment.sender_id,
      recipID: payment.recip_id
    }, (status) => {
      payment.status = status
      payments[pid] = payment
      if (INDEX === paymentOnboardingState.who.length - 1)
        cb(payments) // return payments to caller
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
  let {paymentType, senderID, recipID, currentUser} = params

  if (!senderID || !recipID) {
    cb("pendingInvite")
  } else {
    let currentUserIsSender = currentUser.uid === senderID
    let path = `/appFlags/${(currentUserIsSender) ? recipID : senderID}`

    fetchAppFlags(path, (res) => {
      let senderAppFlags = (currentUserIsSender) ? currentUser.appFlags : res
      let recipAppFlags = (currentUserIsSender) ? res : currentUser.appFlags

      let senderOnboardingProgress = senderAppFlags.onboardingProgress
      let recipOnboardingProgress = recipAppFlags.onboardingProgress

      let senderNeedsBank = senderOnboardingProgress === "need-bank" || senderOnboardingProgress.indexOf("microdeposits") >= 0
      let recipNeedsBank = recipOnboardingProgress === "need-bank" || recipOnboardingProgress.indexOf("microdeposits") >= 0
      let recipNeedsKYC = recipOnboardingProgress.indexOf("kyc") >= 0 && recipOnboardingProgress !== "kyc-success" && recipOnboardingProgress !== "kyc-successDismissed"

      let paymentStatus
      if (senderNeedsBank && recipNeedsBank || recipNeedsKYC)
        paymentStatus = "pendingBothFundingSource"
      else if (senderNeedsBank)
        paymentStatus = "pendingSenderFundingSource"
      else if (recipNeedsBank)
        paymentStatus = "pendingRecipFundingSource"
      else
        paymentStatus = "active"

      cb(paymentStatus)
    })
  }

  function fetchAppFlags(path, callback) {
    firebase.database().ref(path).once('value', (snapshot) => {
      let val = snapshot.val()
      callback(val)
    })
  }
}

export function formatPaymentOnboardingState(params) {
  let {pid, state, paymentType, currentUser, otherUser} = params

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

  let inviteDetails = {
    invite: (otherUser.uid) ? false : true,
    invitee: (sender.sender_id === currentUser.uid) ? "recip" : "sender",
    phone: (otherUser.phone) ? parseInt(otherUser.phone) : null
  }

  let paymentDetails = {
    amount: parseInt((state.howMuch.indexOf("$") >= 0) ? state.howMuch.slice(1) : howMuch),
    payments: parseInt(state.howLong.split(" ")[0]),
    paymentsMade: 0,
    purpose: state.whatFor,
    frequency: state.howOften,
    startTime: state.startUTCString,
    type: (state.confirming === "pay") ? "payment" : "request",
    created_at: Date.now(),
    token: currentUser.token,
    pid
  }

  return Object.assign({}, sender, recip, inviteDetails, paymentDetails)
}
