import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Animated, Easing, Dimensions, Modal } from 'react-native'
import { colors } from '../../globalStyles'
import { IAVWebView, KYCOnboardingView } from '../index'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class StatusCard extends React.Component {
  constructor(props) {
    super(props)

    this.config = {
      'need-bank': {
        message: "need-bank",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      },
      'need-kyc': {
        message: "need-kyc",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView currentUser={this.props.currentUser} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Bank Account Verification"
        })
      },
      'kyc-retry': {
        message: "kyc-retry"
      },
      'kyc-documentNeeded': {
        message: "kyc-documentNeeded"
      },
      'kyc-documentProcessing': {
        message: "kyc-documentProcessing"
      },
      'kyc-documentReceived': {
        message: "kyc-documentReceived"
      },
      'kyc-suspended': {
        message: "kyc-suspended"
      },
      'microdeposits-initialized': {
        message: "microdeposits-initialized"
      },
      'microdeposits-deposited': {
        message: "microdeposits-deposited"
      },
      'microdeposits-failed':{
        message: "microdeposits-failed"
      }
    }

    let onboardingProgress = props.currentUser.appFlags['onboardingProgress']

    this.state = {
      pressable: (this.config[onboardingProgress]) ? this.config[onboardingProgress].pressable : false,
      modalContent: (this.config[onboardingProgress]) ? this.config[onboardingProgress].modalContent : <View />
    }
  }

  componentWillReceiveProps(nextProps) {
    let currOnboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    let newOnboardingProgress = nextProps.currentUser.appFlags['onboardingProgress']

    if (currOnboardingProgress !== newOnboardingProgress) {
      this.setState({
        pressable: (this.config[newOnboardingProgress]) ? this.config[newOnboardingProgress].pressable : false,
        modalContent: (this.config[newOnboardingProgress]) ? this.config[newOnboardingProgress].modalContent : <View />
      })
    }
  }

  handlePress(destination) {
    if (!this.state.pressable) return
    (typeof destination === 'function') ? destination() : null
  }

  render() {
    let {modalContent} = this.state
    let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    let message = (this.config[onboardingProgress]) ? this.config[onboardingProgress].message : "'" + onboardingProgress + "' is not a valid value for the 'onboardingProgress' appFlag"
    let destination = (this.config[onboardingProgress]) ? this.config[onboardingProgress].destination : null

    return(
      <View>
        <TouchableHighlight
          activeOpacity={(this.state.pressable) ? 0.75 : 1.0}
          underlayColor={'transparent'}
          onPress={() => this.handlePress(destination)}>
          <View style={{width: dims.width, padding: 15, backgroundColor: colors.maastrichtBlue, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

            { /* Text */ }
            <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, color: colors.snowWhite}}>
                {message}
              </Text>
            </View>

            { /* Icon */ }
            <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
              {(this.state.pressable)
                ? <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={26} />
                : null }
            </View>

          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = StatusCard
