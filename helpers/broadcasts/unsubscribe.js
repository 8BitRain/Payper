import {Alert} from 'react-native'

function unsubscribe(params) {
  let {broadcast, onConfirm} = params

  let title = `Unsubscribe from ${broadcast.title}`
  let msg = `Are you sure you'd like to unsubscribe?`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = unsubscribe
