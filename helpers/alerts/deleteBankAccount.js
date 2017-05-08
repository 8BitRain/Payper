import {Alert} from 'react-native'

function deleteBankAccount(params) {
  let {bankAccountName, currentUser, onConfirm} = params

  // Make sure user doesn't have any active subscriptions
  if (currentUser.meFeed && currentUser.meFeed["My Subscriptions"]) {
    let subscriptions = currentUser.meFeed["My Subscriptions"]
    for (var i = 0; i < subscriptions.length; i++) {
      let curr = subscriptions[i]
      if (curr.renewal) {
        Alert.alert("Active Subscriptions", "You must unsubscribe from all active subscriptions before you can delete your bank account.")
        return
      }
    }
  }

  let title = `Delete ${currentUser.bankAccount.name}`
  let msg = `Are you sure you'd like to delete this bank account?`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = deleteBankAccount
