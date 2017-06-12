import {Alert} from 'react-native'

function deleteAccount(params) {
  let {broadcast, currentUser, onConfirm} = params

  // Disallow deletion if you currentUser has broadcasts or subscriptions
  let hasBroadcasts = currentUser.meFeed && currentUser.meFeed["My Broadcasts"] && currentUser.meFeed["My Broadcasts"].length > 0
  let hasSubscriptions = currentUser.meFeed && currentUser.meFeed["My Subscriptions"] && currentUser.meFeed["My Subscriptions"].length > 0

  if (hasBroadcasts || hasSubscriptions) {
    let title = `Cannot Delete Account`
    let msg = `You cannot delete your account when you have active broadcasts or subscriptions.`
    Alert.alert(title, msg)
    return
  }

  let title = `Delete Account?`
  let msg = `This cannot be undone!`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = deleteAccount
