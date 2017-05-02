import {Alert} from 'react-native'

function removeFromCast(params) {
  let {member, onConfirm} = params

  let title = `Remove ${member.firstName}`
  let msg = `Are you sure you'd like to kick ${member.firstName} from this cast?`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = removeFromCast
