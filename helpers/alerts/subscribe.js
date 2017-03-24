import {Alert} from 'react-native'

function subscribe(params) {
  let {broadcast, currentUser, onConfirm} = params

  if (!currentUser.bankAccount) {
    Alert.alert("Bank Account", "You must add a bank account before you can subscribe to this broadcast.")
    return
  }

  let title = `Subscribe to ${broadcast.title}`
  let msg = `By subscribing you will pay the first ${broadcast.freq.toLowerCase()} payment of $${broadcast.amount} and agree to the Details of Agreement.`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = subscribe
