import {Alert} from 'react-native'

function subscribe(params) {
  let {broadcast, onConfirm} = params

  let title = `Subscribe to ${broadcast.title}`
  let msg = `By subscribing you will pay the first ${broadcast.freq.toLowerCase()} payment of $${broadcast.amount} and agree to the Details of Agreement.`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = subscribe
