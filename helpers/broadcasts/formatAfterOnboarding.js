function formatAfterOnboarding(substates, currentUser) {
  // Generate broadcast id
  let buffer = []
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 8; i++)
    buffer.push(possible.charAt(Math.floor(Math.random() * possible.length)))
  let castID = buffer.join('')

  // Format tag
  // let tag = substates["Tag"].dropdownListState.selectedTags[0] || substates["Tags"].query
  let tag = substates["Tag"].query
  tag = tag.replace(/\s/g, '')
  tag = tag.toLowerCase()

  // Format visibility
  let visibility = ""
  let {checkboxes} = substates["Who can subscribe?"]
  for (var i in checkboxes) {
    if (true === checkboxes[i].selected) {
      visibility = checkboxes[i].title
      break
    }
  }

  // Rename 'visibility' to be consistent with backend conventions
  if (visibility === "Anyone")
    visibility = "world"
  if (visibility === "Local")
    visibility = "local"
  if (visibility === "Friends of Friends")
    visibility = "friendNetwork"
  if (visibility === "Friends")
    visibility = "friends"

  // Format and return broadcast JSON
  return {
    title: substates["Title"].titleInput,
    amount: substates["Payment"].amountInput,
    freq: substates["Payment"].frequencyInput,
    detailsOfAgreement: substates["Terms of Agreement"].termsInput,
    secret: substates["Terms of Agreement"].hiddenTermsInput,
    memberLimit: Math.round(substates["Subscriber Limit"].spotsInput),
    email: substates["Contact"].emailInput,
    phone: substates["Contact"].phoneInput,
    type: visibility,
    tag: tag,
    members: "",
    createdAt: Date.now(),
    casterID: currentUser.uid,
    castID: castID
  }
}

module.exports = formatAfterOnboarding
