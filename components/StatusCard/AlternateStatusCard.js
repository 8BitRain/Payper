import React from 'react'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, Animated, Dimensions, Modal, Image, StyleSheet, UIManager, findNodeHandle} from 'react-native'
import {colors} from '../../globalStyles'
import {IAVWebView, KYCOnboardingView, PhotoUploader, MicrodepositOnboarding, MicrodepositTooltip, SuspendedTooltip} from '../index'
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import {getOnboardingPercentage} from './helpers'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
const dims = Dimensions.get('window')
const imageDims = { width: 56, height: 56 }
const imageWrapDims = { width: 62, height: 62 }

class AlternateStatusCard extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      opacity: new Animated.Value(1),
      shadowOpacity: new Animated.Value(1),
      marginTop: new Animated.Value(16),
      marginLeft: new Animated.Value(0)
    }

    this.config = {
      'need-bank': {
        title: "Bank Account Needed",
        action: "Next Step: Add Bank Account",
        message: "Add a bank account to unlock the ability to send money.",
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      },
      'need-kyc': {
        title: "Account Verification Needed",
        action: "Next Step: Verify Account",
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView currentUser={this.props.currentUser} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Account Verification"
        })
      },
      'kyc-retry': {
        title: "Account Verification Failed",
        message: "We need a bit more information to verify your account.",
        action: "Next Step: Verify Account",
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView retry currentUser={this.props.currentUser} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Account Verification"
        })
      },
      'kyc-documentNeeded': {
        title: "Additional Documents Required",
        message: "We need a bit more info to verify your account.",
        action: "Next Step: Upload Photo ID",
        destination: () => Actions.GlobalModal({
          subcomponent: <PhotoUploader title={"Document Upload"} index={1} brand={"document"}  toggleModal={() => {Actions.pop()}} currentUser={this.props.currentUser} />,
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
        message: "We're reviewing your information and will notify you when verification is complete."
      },
      'kyc-suspended': {
        title: "Verifying Your Account",
        message: "We're taking a bit longer than usual to verify your account.",
        action: "More Info",
        destination: () => Actions.GlobalModal({
          subcomponent: <SuspendedTooltip closeModal={() => Actions.pop()} />,
          backgroundColor: colors.snowWhite
        })
      },
      'microdeposits-initialized': {
        title: "Microdeposits Initialized",
        message: "We're transferring two small (< 20¢) sums to your bank account and will notify you when they've arrived.",
        action: "More Info",
        destination: () => Actions.GlobalModal({
          subcomponent: <MicrodepositTooltip closeModal={() => Actions.pop()} />,
          backgroundColor: colors.snowWhite
        })
      },
      'microdeposits-deposited': {
        title: "Microdeposits Arrived",
        message: "We've deposited two small (< 20¢) sums to your bank account.",
        action: "Next Step: Verify Microdeposits",
        destination: () => Actions.GlobalModal({
          subcomponent: <MicrodepositOnboarding {...this.props} toggleModal={() => Actions.pop()} />,
          backgroundColor: colors.snowWhite,
          showHeader: true,
          title: "Microdeposit Verification"
        })
      },
      'microdeposits-failed': {
        title: "Microdeposits Failed to Transfer",
        message: "We couldn't send microdeposits with the information provided. Please try again.",
        action: "Next Step: Add Bank Account",
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      },
      'kyc-success': {
        action: "Dismiss",
        destination: () => this.dismiss()
      }
    }

    this.state = {
      onboardingPercentage: 0
    }
  }

  componentDidMount() {
    this.setState({
      onboardingPercentage: getOnboardingPercentage(this.props.currentUser.appFlags)
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      onboardingPercentage: getOnboardingPercentage(nextProps.currentUser.appFlags)
    })
  }

  handlePress(destination) {
    let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    let configInfo = this.config[onboardingProgress]
    let pressable = configInfo && configInfo.action && configInfo.destination

    if (!pressable) return

    if (typeof destination === 'function')
      destination()
  }

  measure(cb) {
    UIManager.measure(findNodeHandle(this.wrap), (x, y, w, h) => cb({x, y, w, h}))
  }

  dismiss() {
    this.measure((dims) => {
      let {marginLeft, marginTop, opacity, shadowOpacity} = this.AV
      let {w, h} = dims

      let animations = [
        Animated.timing(shadowOpacity, {
          toValue: 0,
          duration: 70
        }),
        Animated.parallel([
          Animated.timing(marginLeft, {
            toValue: -1 * w,
            duration: 140
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200
          })
        ]),
        Animated.timing(marginTop, {
          toValue: -1 * h,
          duration: 160
        })
      ]

      Animated.sequence(animations).start(() => {
        let path = `/appFlags/${this.props.currentUser.uid}/onboardingProgress`
        firebase.database().ref(path).set('kyc-successDismissed')
      })
    })
  }

  render() {
    let {currentUser} = this.props
    let onboardingProgress = currentUser.appFlags['onboardingProgress']
    let configInfo = this.config[onboardingProgress]

    // Return an empty view for cases when no StatusCard should be rendered
    if (!configInfo) {
      return(
        <View />
      )
    } else {
      let {onboardingPercentage} = this.state
      let {message, destination, action} = configInfo
      let {cachedProfilePic} = this.props.currentUser
      let profilePic = this.props.currentUser.profile_pic
      let canSendMoney = currentUser.fundingSource
        && onboardingProgress !== "microdeposits-initialized"
        && onboardingProgress !== "microdeposits-deposited"
        && onboardingProgress !== "microdeposits-failed"
      let canReceiveMoney = onboardingProgress === "kyc-success"

      return(
        <Animated.View
          ref={ref => this.wrap = ref}
          style={{
            marginLeft: this.AV.marginLeft,
            marginTop: this.AV.marginTop,
            opacity: this.AV.opacity
          }}>

          { /* Shadow must be absolutely position due to 'overflow: hidden'
               style on actual container */ }
          <Animated.View
            style={{
              position: 'absolute', top: 0, left: dims.width * 0.06, right: dims.width * 0.06, bottom: 0, borderRadius: 5,
              shadowColor: colors.medGrey,
              shadowOpacity: this.AV.shadowOpacity,
              shadowRadius: 2,
              shadowOffset: { height: 0, width: 0}
            }} />

          <View
            style={{
              width: dims.width * 0.88, marginLeft: dims.width * 0.06, backgroundColor: colors.snowWhite,
              borderRadius: 5, overflow: 'hidden'
            }}>

            { /* Top third (profile strength) */ }
            <View style={{justifyContent: 'center', paddingBottom: 12}}>
              { /* "My Profile Strength" */ }
              <View style={{flex: 1.0, backgroundColor: '#efebf2'}}>
                <Text style={{fontSize: 18, padding: 10, color: colors.deepBlue, textAlign: 'center'}}>
                  {"My Account Strength"}
                </Text>
              </View>

              { /* Profile pic and onboarding percentage */ }
              <View
                style={{
                  marginLeft: 8, flexDirection: 'row', alignItems: 'center',
                  justifyContent: 'center', paddingTop: 10, paddingBottom: 6
                }}>
                <View style={styles.imageWrap}>
                  <AnimatedCircularProgress
                    size={imageWrapDims.width}
                    width={6}
                    fill={onboardingPercentage}
                    tintColor={colors.accent}
                    backgroundColor={colors.medGrey}>
                    {(fill) => <View style={styles.imageBorder} />}
                  </AnimatedCircularProgress>
                  {(cachedProfilePic || profilePic)
                    ? <Image style={styles.image} source={{uri: cachedProfilePic || profilePic}} />
                    : <View style={styles.image}>
                        <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                          {currentUser.first_name.charAt(0) + currentUser.last_name.charAt(0)}
                        </Text>
                      </View> }
                </View>

                <View style={{width: 20}} />

                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 56, color: colors.accent, fontWeight: '200'}}>
                    {onboardingPercentage}
                  </Text>
                  <Text style={{fontSize: 28, color: colors.accent, fontWeight: '200', marginLeft: 6, marginTop: 7}}>
                    {"%"}
                  </Text>
                </View>
              </View>

              { /* Locked and unlocked features */ }
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <EvilIcons name={(canSendMoney) ? "unlock" : "lock"} size={24} color={(canSendMoney) ? colors.deepBlue : colors.slateGrey} />
                  <Text style={{fontSize: 17, color: (canSendMoney) ? colors.deepBlue : colors.slateGrey, fontWeight: '200'}}>
                    {"Send Money"}
                  </Text>
                </View>

                { /* Spacer */ }
                <View style={{width: 0}} />

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
                : <View style={{padding: 12, paddingBottom: 22, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15, color: colors.deepBlue}}>
                      {message}
                    </Text>
                  </View> }

            { /* Bottom third (action button) */
              (!action || !destination)
                ? null
                : <TouchableHighlight
                    style={{padding: 16, backgroundColor: colors.accent, justifyContent: 'center'}}
                    activeOpacity={0.95}
                    underlayColor={colors.accent}
                    onPress={() => destination()}>
                    <Text style={{fontSize: 16, color: colors.lightGrey, textAlign: 'center'}}>
                      {action}
                    </Text>
                  </TouchableHighlight> }
          </View>
        </Animated.View>
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
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
