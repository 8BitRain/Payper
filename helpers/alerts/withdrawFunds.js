import {Alert} from 'react-native'

function widthdrawFunds(params) {
  let {amount, bankAccountName, onConfirm} = params

  let title = `Transfer Funds`
  let msg = `Are you sure you'd like to transfer $${amount} to '${bankAccountName}'?`

  Alert.alert(title, msg, [
    {text: 'Cancel', style: 'cancel'},
    {text: 'Confirm', onPress: onConfirm}
  ])
}

module.exports = widthdrawFunds
