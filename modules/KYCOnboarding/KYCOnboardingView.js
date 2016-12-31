import React from 'react'
import { View, Text, TouchableHighlight, StatusBar, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { colors } from "../../globalStyles"
const dims = Dimensions.get('window')

class KYCOnboardingView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log("--> KYCOnboardingView will mount with props...\n", this.props)
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite}}>
        <StatusBar barStyle={"default"} />

        <Text style={{textAlign: 'center', width: dims.width * 0.85, margin: 5, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.carminePink, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
          {"KYCOnboardingView.js"}
        </Text>

        <Text style={{width: dims.width * 0.85, margin: 5, fontSize: 14, color: colors.deepBlue, backgroundColor: colors.lightGrey, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
          {"This view onboards all info required by Dwolla's White Label Guide for KYC verification. It should be made clear to the user that this process is optional (advantages of verification should be explained), and that the process will strengthen the security of the user's sensitive information."}
        </Text>

        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => Actions.MainViewContainer()}>
          <Text style={{textAlign: 'center', width: dims.width * 0.85, margin: 5, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.accent, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
            {"Continue"}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = KYCOnboardingView
