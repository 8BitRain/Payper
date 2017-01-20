function formatAlert(users, isRequest, currentUser) {
  let userNeedsBank = currentUser.appFlags.onboardingProgress === "need-bank" || currentUser.appFlags.onboardingProgress.indexOf("microdeposits") >= 0
  let userNeedsToVerifyAccount = currentUser.appFlags.customer_status !== "verified"

  let alert

  if (userNeedsBank && userNeedsToVerifyAccount)
    alert = `Your payments ${(isRequest) ? `from` : `to`} ${recipients} won't commence until you've linked your bank and verified your account.`
  else if (userNeedsBank)
    alert = `Your payments ${(isRequest) ? `from` : `to`} ${recipients} won't commence until you've added a bank account.`
  else if (userNeedsToVerifyAccount)
    alert = `Your payments ${(isRequest) ? `from` : `to`} ${recipients} won't commence until you've verified your account.`

  return alert
}

module.exports = formatAlert
