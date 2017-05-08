import {Alert} from 'react-native'

function deleteAccount(params) {
  let {broadcast, onConfirm} = params

  let title = `Delete Account?`
  let msg = `This cannot be undone!`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = deleteAccount
