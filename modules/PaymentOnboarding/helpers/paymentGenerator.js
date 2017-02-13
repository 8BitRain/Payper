import firebase from 'firebase'
import moment from 'moment'
import * as config from '../../../config'
import * as Lambda from '../../../services/Lambda'
const baseURL = config.details[config.details.env].lambdaBaseURL

export function generatePayments(params, cb) {
  let {paymentOnboardingState, currentUser, appFlagMap} = params
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
      currentUser, appFlagMap,
      paymentType: paymentOnboardingState.confirming,
      senderID: payment.sender_id,
      recipID: payment.recip_id
    }, (status) => {
      payment.status = status
      payments[pid] = payment
      if (INDEX === paymentOnboardingState.who.length - 1) {
        cb(payments) // return payments to caller for optimistic rendering
        storePayments(payments) // store payments in Firebase
      }
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
  let {appFlagMap, paymentType, senderID, recipID, currentUser} = params

  if (!senderID || !recipID) {
    cb("pendingInvite")
  } else {
    let currentUserIsSender = currentUser.uid === senderID

    let senderAppFlags = (currentUserIsSender) ? currentUser.appFlags : appFlagMap[senderID]
    let recipAppFlags = (currentUserIsSender) ? appFlagMap[recipID] : currentUser.appFlags

    let senderOnboardingProgress = senderAppFlags.onboardingProgress
    let recipOnboardingProgress = recipAppFlags.onboardingProgress

    let senderNeedsBank = senderOnboardingProgress === "need-bank" || senderOnboardingProgress.indexOf("microdeposits") >= 0
    let recipNeedsBank = recipOnboardingProgress === "need-bank" || recipOnboardingProgress.indexOf("microdeposits") >= 0
    let recipNeedsKYC = recipOnboardingProgress.indexOf("kyc") >= 0 && recipOnboardingProgress !== "kyc-success" && recipOnboardingProgress !== "kyc-successDismissed"

    let paymentStatus

    if (paymentType === "request")
      paymentStatus = "pendingConfirmation"
    else if (senderNeedsBank && recipNeedsBank || recipNeedsKYC)
      paymentStatus = "pendingBothFundingSources"
    else if (senderNeedsBank)
      paymentStatus = "pendingSenderFundingSource"
    else if (recipNeedsBank)
      paymentStatus = "pendingRecipFundingSource"
    else
      paymentStatus = "active"

    cb(paymentStatus)
  }
}

export function formatPaymentOnboardingState(params) {
  let {pid, state, paymentType, currentUser, otherUser} = params

  // Default to five minutes from now for start time
  if (!state.startUTCString) {
    let startUTCString = moment().add(5, 'minutes').utc().valueOf()
    state.startUTCString = startUTCString
  }

  let sender = {
    sender_id: (paymentType === "request") ? otherUser.uid : currentUser.uid,
    sender_username: (paymentType === "request") ? otherUser.username : currentUser.username,
    sender_pic: (paymentType === "request") ? otherUser.profile_pic : currentUser.profile_pic,
    sender_name: (paymentType === "request") ? `${otherUser.first_name} ${otherUser.last_name}` : `${currentUser.first_name} ${currentUser.last_name}`,
    first_name: (paymentType === "request") ? otherUser.first_name : currentUser.first_name,
    last_name: (paymentType === "request") ? otherUser.last_name : currentUser.last_name
  }

  let recip = {
    recip_id: (paymentType === "pay") ? otherUser.uid : currentUser.uid,
    recip_username: (paymentType === "pay") ? otherUser.username : currentUser.username,
    recip_pic: (paymentType === "pay") ? otherUser.profile_pic : currentUser.profile_pic,
    recip_name: (paymentType === "pay") ? `${otherUser.first_name} ${otherUser.last_name}` : `${currentUser.first_name} ${currentUser.last_name}`,
    first_name: (paymentType === "pay") ? otherUser.first_name : currentUser.first_name,
    last_name: (paymentType === "pay") ? otherUser.last_name : currentUser.last_name
  }

  // Remove 'undefined's
  for (var k in recip)
    if (typeof recip[k] === 'undefined') delete recip[k]
  for (var k in sender)
    if (typeof sender[k] === 'undefined') delete sender[k]

  let inviteDetails = {
    invite: (otherUser.uid) ? false : true,
    invitee: (sender.sender_id === currentUser.uid) ? "recip" : "sender",
    phone: (otherUser.phone) ? parseInt(otherUser.phone) : null,
    phoneNumber: (otherUser.phone) ? otherUser.phone : null
  }

  let paymentDetails = {
    amount: parseInt((state.howMuch.indexOf("$") >= 0) ? state.howMuch.slice(1) : howMuch),
    payments: parseInt(state.howLong.split(" ")[0]),
    paymentsMade: 0,
    purpose: state.whatFor,
    frequency: state.howOften,
    startTime: state.startUTCString,
    start: state.startUTCString,
    nextPayment: state.startUTCString,
    type: (state.confirming === "pay") ? "payment" : "request",
    created_at: Date.now(),
    token: currentUser.token,
    sender, recip, pid
  }

  return Object.assign({}, sender, recip, inviteDetails, paymentDetails)
}

export function storePayments(payments) {
  setTimeout(() => {
    for (var pid in payments)
      storePayment(payments[pid])
  }, 100)

  function storePayment(payment) {
    let {pid, type, sender_id, recip_id, invite} = payment

    let activePaymentsPath = `activePayments/${pid}`
    let pendingPaymentsPath = `pendingPayments/${pid}`
    let payFlowPath = `paymentFlow/${(type === 'request') ? recip_id : sender_id}/${(type === 'request') ? 'in' : 'out'}/${pid}`

    // Strip payment JSON of 'undefined's
    for (var k in payment) {
      if (typeof payment[k] === 'undefined')
        delete payment[k]
    }

    // Write to payFlow in Firebase
    firebase.database().ref(payFlowPath).set(payment)

    // Queue the invite
    if (invite) {
      Lambda.inviteViaPayment(payment)
    }

    // Write to activePayments in Firebase
    // then queue the payment
    else {
      let params = {token: payment.token, pid: payment.pid}
      let path = (type === "request") ? pendingPaymentsPath : activePaymentsPath
      let endpoint = (payment.type === "request") ? "payments/request" : "payments/queue"

      firebase.database().ref(path).set(payment, () => {
        try {
          fetch(baseURL + endpoint, {method: "POST", body: JSON.stringify(params)})
          .then((response) => response.json())
          .then((responseData) => {
            console.log(`--> ${endpoint} responseData`, responseData)
          })
          .done()
        } catch(err) {
          console.log(err)
        }
      })
    }
  }
}
