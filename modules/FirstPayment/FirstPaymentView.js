import React from 'react'
import { View, Text, TouchableHighlight, StatusBar, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { colors } from "../../globalStyles"
const dims = Dimensions.get('window')

class FirstPaymentView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log("--> FirstPaymentView will mount with props...\n", this.props)
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite}}>
        <StatusBar barStyle={"default"} />

        <Text style={{textAlign: 'center', width: dims.width * 0.85, margin: 5, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.carminePink, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
          {"FirstPaymentView.js"}
        </Text>

        <Text style={{width: dims.width * 0.85, margin: 5, fontSize: 14, color: colors.deepBlue, backgroundColor: colors.lightGrey, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
          {"This view renders the first payment or request awaiting action from the user. If there's no real payment waiting, 'The Payper Team' will send the user $0.01. One button prompts the user to add a bank account, explaining the benefits of having a bank account linked. The other button allows the user to skip this view and go straight to the app."}
        </Text>

        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => Actions.MainViewContainer()}>
          <Text style={{textAlign: 'center', width: dims.width * 0.85, margin: 5, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.accent, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
            {"Continue to app"}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = FirstPaymentView
