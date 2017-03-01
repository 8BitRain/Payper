function formatBroadcast(substates, currentUser) {
  let updates = {}

  // Generate broadcast id
  let buffer = []
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 8; i++)
    buffer.push(possible.charAt(Math.floor(Math.random() * possible.length)))
  let bid = buffer.join('')

  // Format tags
  let tags = []
  for (var k in substates["Tags"].selectedTags) tags.push(k)

  // Format broadcast JSON
  updates[bid] = {
    title: substates["Title"].titleInput,
    amount: substates["Amount and Frequency"].amountInput,
    frequency: substates["Amount and Frequency"].frequencyInput,
    memo: substates["Details of Agreement"].doaInput,
    hiddenInfo: substates["Secret"].secretInput,
    memberLimit: Math.round(substates["Member Limit"].spotsInput),
    tag: tags,
    memberIDs: "",
    createdAt: Date.now(),
    casterID: currentUser.uid,
    bid: bid
  }

  return updates
}

module.exports = formatBroadcast
