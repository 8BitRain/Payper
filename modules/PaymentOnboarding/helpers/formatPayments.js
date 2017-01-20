function formatPayments(state, currentUser) {
  let {
    who, howMuch, howOften, howLong, whatFor,
    startDay, startMonth, startYear, startUTCString,
    confirming
  } = state

  let formattedPayments = {}

  for (var k in who) {
    let pid = Math.random().toString().substring(3, 10)
    let user = who[k]
    let thisUser = currentUser.getPaymentAttributes()
    let otherUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      profile_pic: user.profile_pic,
      username: user.username,
      uid: user.uid,
      phone: user.phone
    }
    let paymentInfo = {
      pid: pid,
      recip_id: otherUser.uid,
      recip_name: otherUser.first_name + " " + otherUser.last_name,
      recip_pic: otherUser.profile_pic,
      recip_username: otherUser.username,
      sender_id: thisUser.uid,
      sender_name: thisUser.first_name + " " + otherUser.last_name,
      sender_pic: thisUser.profile_pic,
      sender_username: thisUser.username,
      // sender: thisUser,
      // recip: otherUser,
      invite: (otherUser.uid) ? false : true,
      phoneNumber: otherUser.phone,
      invitee: "recip",
      amount: (howMuch.indexOf("$") >= 0) ? howMuch.slice(1) : howMuch,
      frequency: howOften.toUpperCase(),
      payments: howLong.split(" ")[0],
      purpose: whatFor,
      type: "payment",
      token: currentUser.token,
      start: startUTCString
    }
    formattedPayments[pid] = paymentInfo
  }

  return formattedPayments
}

module.exports = formatPayments
