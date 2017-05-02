import {Alert} from 'react-native'

function deleteCast(params) {
  let {broadcast, onConfirm} = params

  let title = `Delete ${broadcast.title}`
  let msg = `Are you sure you'd like to delete this broadcast?`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = deleteCast
