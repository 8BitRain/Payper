function formatAlert(users, isRequest, currentUser) {
  let userNeedsBank =
    currentUser.appFlags.onboardingProgress === "need-bank"
    || currentUser.appFlags.onboardingProgress.indexOf("microdeposits") >= 0
  let userNeedsToVerifyAccount = currentUser.appFlags.customer_status !== "verified"

  // Format recipients string
  let recipients = ""
  if (users.length === 1) {
    recipients = users[0].first_name
  } else if (users.length === 2) {
    recipients = users[0].first_name + " and " + users[1].first_name
  } else {
    for (var i = 0; i < users.length; i++) {
      let curr = users[i]
      recipients += (i < users.length - 1)
        ? curr.first_name + ", "
        : "and " + curr.first_name
    }
  }

  // Format alert string
  let alert
  if (userNeedsBank)
    alert = `Your payments ${(isRequest) ? `from` : `to`} ${recipients} won't commence until you've added a bank account.`
  else if (isRequest && userNeedsToVerifyAccount)
    alert = `Your payments from ${recipients} won't commence until you've verified your account.`

  return alert
}

module.exports = formatAlert
