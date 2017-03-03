function formatAfterOnboarding(substates, currentUser) {

  console.log("--> formatAfterOnboarding was invoke with substates", substates)

  // Generate broadcast id
  let buffer = []
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 8; i++)
    buffer.push(possible.charAt(Math.floor(Math.random() * possible.length)))
  let castID = buffer.join('')

  // Format tags
  let tag = substates["Tags"].dropdownListState.selectedTags[0] || substates["Tags"].query

  // Format visibility
  let visibility = ""
  let {checkboxes} = substates["Broadcast Visibility"]
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
    amount: substates["Amount and Frequency"].amountInput,
    freq: substates["Amount and Frequency"].frequencyInput,
    detailsOfAgreement: substates["Details of Agreement"].doaInput,
    secret: substates["Secret"].secretInput,
    memberLimit: Math.round(substates["Member Limit"].spotsInput),
    type: visibility,
    tag: tag,
    memberIDs: "",
    createdAt: Date.now(),
    casterID: currentUser.uid,
    castID: castID
  }

}

module.exports = formatAfterOnboarding
