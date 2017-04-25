import {Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'

function subscribe(params) {
  let {broadcast, currentUser, onConfirm} = params

  if (!currentUser.bankReference) {
    let title = "Bank Account"
    let msg = "You must add a bank account before you can subscribe to this broadcast."
    let options = [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Add Bank', onPress: Actions.BankAccounts}
    ]
    Alert.alert(title, msg, options)
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
