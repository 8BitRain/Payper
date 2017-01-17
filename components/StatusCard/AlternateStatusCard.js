import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, Animated, Easing, Dimensions, Modal, Image, StyleSheet} from 'react-native'
import {colors} from '../../globalStyles'
import {IAVWebView, KYCOnboardingView, PhotoUploader, MicrodepositOnboarding} from '../index'
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import {getOnboardingPercentage} from './helpers'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
const dims = Dimensions.get('window')
const imageDims = { width: 56, height: 56 }

class AlternateStatusCard extends React.Component {
  constructor(props) {
    super(props)

    this.config = {
      'need-bank': {
        title: "Bank Account Needed",
        message: "You won't be able to send money until you add a bank account.",
        action: "Add Bank Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      },
      'need-kyc': {
        title: "Account Verification Needed",
        message: "You won't be able to receive money until you verify your account.",
        action: "Verify Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView currentUser={this.props.currentUser} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Account Verification"
        })
      },
      'kyc-retry': {
        title: "Account Verification Failed",
        message: "Try verifying your account again with slightly more detailed information.",
        action: "Verify Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView retry currentUser={this.props.currentUser} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Account Verification"
        })
      },
      'kyc-documentNeeded': {
        title: "Additional Documents Required",
        message: "We need a bit more info to verify your account. Please take a snapshot of a valid photo ID.",
        action: "Take Snapshot",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <PhotoUploader title={"Document Upload"} index={1} brand={"document"}  {...this.props}/>,
          backgroundColor: colors.snowWhite,
          showHeader: false,
          title: "Document Upload"
        })
      },
      'kyc-documentProcessing': {
        title: "Verifying Your Account",
        message: "We're processing your information and will notify you when verification is complete."
      },
      'kyc-documentReceived': {
        title: "Verifying Your Account",
        message: "We're processing your information and will notify you when verification is complete."
      },
      'kyc-suspended': {
        title: "Verifying Your Account",
        message: "We're processing your information and will notify you when verification is complete."
      },
      'microdeposits-initialized': {
        title: "Microdeposits Initialized",
        message: "We're transferring two small (< 20¢) sums to your bank account. We will notify you when they've arrived."
      },
      'microdeposits-deposited': {
        title: "Microdeposits Arrived",
        message: "We've deposited two small (< 20¢) sums to your bank account and are awaiting your verification.",
        action: "Verify Microdeposits",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <MicrodepositOnboarding {...this.props} toggleModal={() => Actions.pop()} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Microdeposit Verification"
        })
      },
      'microdeposits-failed': {
        title: "Microdeposits Failed to Transfer",
        message: "Please try adding your bank account again. Be sure to double check your routing and account number.",
        action: "Add Bank Account",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      }
    }

    this.state = {
      onboardingPercentage: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      onboardingPercentage: getOnboardingPercentage(nextProps.currentUser.appFlags)
    })
  }

  handlePress(destination) {
    let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    let pressable = (this.config[onboardingProgress])
      ? this.config[onboardingProgress].pressable
      : false

    if (!pressable) return

    if (typeof destination === 'function')
      destination()
  }

  render() {
    let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    let configInfo = this.config[onboardingProgress]

    // Return an empty view for cases where no StatusCard should be rendered
    if (!configInfo) {
      return(
        <View />
      )
    } else {
      let message = configInfo.message
      let destination = configInfo.destination
      let action = configInfo.action

      return(
        <View style={{width: dims.width * 0.94, marginLeft: dims.width * 0.03, borderRadius: 5, marginTop: 8, overflow: 'hidden', height: 300, backgroundColor: colors.snowWhite}}>
          { /* Top third (profile strength) */ }
          <View style={{flex: 0.333, backgroundColor: 'red'}} />

          { /* Middle third (info) */
            (!message)
              ? null
              : <View style={{flex: 0.333, backgroundColor: colors.accent}} /> }

          { /* Bottom third (action button) */
            (!action || !destination)
              ? null
              : <View>
                  <TouchableHighlight
                    activeOpacity={0.7}
                    underlayColor={'transparent'}
                    onPress={() => alert("Pressed action")}>
                    <Text style={{flex: 1.0, fontSize: 16, color: colors.accent, padding: 14, textAlign: 'center'}}>
                      {action}
                    </Text>
                  </TouchableHighlight>
                </View> }
        </View>
      )
    }
  }
}

module.exports = AlternateStatusCard
