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
const imageWrapDims = { width: 60, height: 60 }

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
    let {currentUser} = this.props
    let onboardingProgress = currentUser.appFlags['onboardingProgress']
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
      let {onboardingPercentage} = this.state
      let profilePic = this.props.currentUser.profile_pic
      let canSendMoney = currentUser.fundingSource
        && onboardingProgress !== "microdeposits-initialized"
        && onboardingProgress !== "microdeposits-deposited"
        && onboardingProgress !== "microdeposits-failed"
      let canReceiveMoney = onboardingProgress === "kyc-success"

      return(
        <View
          style={{
            width: dims.width * 0.94, marginLeft: dims.width * 0.03, marginTop: 8, backgroundColor: colors.snowWhite,
            shadowColor: colors.medGrey,
            shadowOpacity: 1.0,
            shadowRadius: 2,
            shadowOffset: {
              height: 0,
              width: 0
            }
          }}>

          { /* Top third (profile strength) */ }
          <View style={{justifyContent: 'center', paddingBottom: 12}}>
            { /* "My Profile Strength" */ }
            <Text style={{fontSize: 18, padding: 10, color: colors.deepBlue, textAlign: 'center'}}>
              {"My Account Strength"}
            </Text>

            { /* Profile pic and onboarding percentage */ }
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <View style={styles.imageWrap}>
                <AnimatedCircularProgress
                  size={imageWrapDims.width}
                  width={4}
                  fill={onboardingPercentage}
                  tintColor={colors.accent}
                  backgroundColor={colors.medGrey}>
                  {(fill) => <View style={styles.imageBorder} />}
                </AnimatedCircularProgress>
                <Image style={styles.image} source={{uri: profilePic}} />
              </View>

              <View style={{width: 20}} />

              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 56, color: colors.accent, fontWeight: '200'}}>
                  {onboardingPercentage}
                </Text>
                <Text style={{fontSize: 28, color: colors.accent, fontWeight: '200', marginTop: 6}}>
                  {"%"}
                </Text>
              </View>
            </View>

            { /* Locked and unlocked features */ }
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <EvilIcons name={(canSendMoney) ? "unlock" : "lock"} size={24} color={(canSendMoney) ? colors.deepBlue : colors.slateGrey} />
                <Text style={{fontSize: 17, color: (canSendMoney) ? colors.deepBlue : colors.slateGrey, fontWeight: '200'}}>
                  {"Send Money"}
                </Text>
              </View>

              { /* Spacer */ }
              <View style={{width: 6}} />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <EvilIcons name={(canReceiveMoney) ? "unlock" : "lock"} size={24} color={(canReceiveMoney) ? colors.deepBlue : colors.slateGrey} />
                <Text style={{fontSize: 17, color: (canReceiveMoney) ? colors.deepBlue : colors.slateGrey, fontWeight: '200'}}>
                  {"Receive Money"}
                </Text>
              </View>
            </View>
          </View>

          { /* Middle third (info) */
            (!message)
              ? null
              : <View style={{flex: 1.0, padding: 12, paddingBottom: 18, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 15, color: colors.deepBlue}}>
                    {message}
                  </Text>
                </View> }

          { /* Bottom third (action button) */
            (!action || !destination)
              ? null
              : <TouchableHighlight
                  style={{flex: 1.0, padding: 16, backgroundColor: colors.gradientGreen, justifyContent: 'center'}}
                  activeOpacity={0.95}
                  underlayColor={colors.accent}
                  onPress={() => destination()}>
                  <Text style={{fontSize: 16, color: colors.snowWhite, textAlign: 'center'}}>
                    {"Next Step: "}
                    {action}
                  </Text>
                </TouchableHighlight> }
        </View>
      )
    }
  }
}

const styles = {
  wrap: {
    backgroundColor: colors.snowWhite,
    paddingTop: 20,
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  image: {
    position: 'absolute',
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    top: (imageWrapDims.height - imageDims.height) / 2,
    left: (imageWrapDims.width - imageDims.width) / 2,
  },
  imageBorder: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  imageWrap: {
    width: imageWrapDims.width,
    height: imageWrapDims.height,
    justifyContent: 'center',
    alignItems: 'center'
  }
}

module.exports = AlternateStatusCard
