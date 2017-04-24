import React from 'react'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, Animated, Dimensions, Modal, Image, StyleSheet} from 'react-native'
import {colors} from '../globalStyles'
import {IAVWebView, KYCOnboardingView, PhotoUploader} from './'
import {SuspendedTooltip, MicrodepositTooltip} from './Tooltips'
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import {getOnboardingPercentage, uploadKYCDocument} from '../helpers/utils'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
const dims = Dimensions.get('window')
const imageDims = {width: 56, height: 56}
const imageWrapDims = {width: 62, height: 62}

class StatusCard extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      opacity: new Animated.Value(1),
      height: undefined // defined on mount in layout()
    }

    this.config = {
      'need-bank': {
        title: "Bank Account Needed",
        action: "Next Step: Add Bank Account",
        destination: () => Actions.IAV()
      },
      'need-kyc': {
        title: "Account Verification Needed",
        action: "Next Step: Verify Account",
        destination: () => Actions.KYCOnboardingView({
          currentUser: this.props.currentUser
        })
      },
      'kyc-retry': {
        title: "Account Verification Failed",
        message: "We need a bit more information to verify your account.",
        action: "Next Step: Verify Account",
        destination: () => Actions.KYCOnboardingView({
          currentUser: this.props.currentUser,
          retry: true
        })
      },
      'kyc-documentNeeded': {
        title: "Additional Documents Required",
        message: "We need a bit more info to verify your account.",
        action: "Next Step: Upload Photo ID",
        destination: () => Actions.Camera({
          showHeader: true,
          headerProps: {
            showTitle: true, title: "Title",
            showBackButton: true
          },
          onUpload: (uri) => {
            // Optimistically update appFlags
            let {appFlags} = this.props.currentUser
            appFlags.onboardingProgress = "kyc-documentProcessing"
            this.props.currentUser.update({appFlags})

            // Page back
            Actions.pop()

            // Hit backend
            uploadKYCDocument({
              uri: uri,
              email: this.props.currentUser.decryptedEmail,
              token: this.props.currentUser.token
            }, (url, err) => (err) ? console.log("--> Error thrown by uploadKYCDocument", err) : null)
          }
        })
      },
      'kyc-documentProcessing': {
        title: "Verifying Your Account",
        message: "We're processing your information and will notify you when your account verification is complete."
      },
      'kyc-documentReceived': {
        title: "Verifying Your Account",
        message: "We're reviewing your information and will notify you when your account verification is complete."
      },
      'kyc-suspended': {
        title: "Verifying Your Account",
        message: "Your account verification is taking a bit longer than usual. We'll notify you when it's complete!"
      },
      'microdeposits-initialized': {
        title: "Microdeposits Initialized",
        message: "We're transferring two small (< 20¢) sums to your bank account and will notify you when they've arrived."
      },
      'microdeposits-deposited': {
        title: "Microdeposits Arrived",
        message: "We've deposited two small (< 20¢) sums to your bank account.",
        action: "Next Step: Verify Microdeposits",
        destination: () => Actions.MicrodepositOnboarding({
          toggleModal: Actions.pop,
          currentUser: this.props.currentUser
        })
      },
      'microdeposits-failed': {
        title: "Microdeposits Failed to Transfer",
        message: "We couldn't send your microdeposits with the information provided. Please try again.",
        action: "Next Step: Add Bank Account",
        destination: () => Actions.IAV()
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

  layout(e) {
    let height = e.nativeEvent.layout.height
    this.AV.height = new Animated.Value(height)
    console.log("--> laying out component with height:", height)
  }

  dismiss() {
    let {height, opacity} = this.AV

    let animations = [
      Animated.timing(height, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180
      })
    ]

    Animated.parallel(animations).start(() => {
      let {uid} = this.props.currentUser
      let path = `/appFlags/${uid}/onboardingProgress`
      firebase.database().ref(path).set('kyc-successDismissed')
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
      let {height, opacity} = this.AV
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
          onLayout={(e) => this.layout(e)}
          style={{height, opacity}}>

          { /* Shadow must be absolutely position due to 'overflow: hidden'
               style on actual container */ }
          <View
            style={{
              position: 'absolute', top: 22, left: dims.width * 0.06, right: dims.width * 0.06, bottom: 12, borderRadius: 5,
              shadowColor: colors.medGrey,
              shadowOpacity: 1.0,
              shadowRadius: 2,
              shadowOffset: { height: 0, width: 0}
            }} />

          <View
            style={{
              width: dims.width * 0.88, marginLeft: dims.width * 0.06, marginTop: 22, marginBottom: 12, backgroundColor: colors.snowWhite,
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
              <View style={{marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
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
                    : <View style={styles.image}><Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                        {currentUser.initials}
                      </Text></View> }
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

module.exports = StatusCard
