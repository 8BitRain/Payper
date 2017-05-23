import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Alert} from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {Header, BroadcastsFeed, ExploreFeed, MeFeed} from '../../components'
import {updateFCMToken, updateUserTags, getDecryptedUserData} from '../../helpers/lambda'
import {handlePushNotification, uploadKYCDocument} from '../../helpers/utils'
import Button from 'react-native-button'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import * as dispatchers from './MainState'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  newBroadcastButtonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50, height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 3,
    shadowOffset: {height: 0, width: 0}
  }
})

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: "Broadcasts",
      tabIndicators: "me"
    }

    this.changeTab = this.changeTab.bind(this)
  }

  componentDidMount() {
    setTimeout(() => FCM.requestPermissions(), 600)
    FCM.getFCMToken().then((FCMToken) => updateFCMToken({FCMToken, token: this.props.currentUser.token}))

    if (FCM.initialData) {
      FCM.initialData.opened_from_tray = true
      handlePushNotification(FCM.initialData)
      setTimeout(() => {FCM.initialData = null})
    }

    this.notificationLisener = FCM.on('notification', (notification) => handlePushNotification(notification))
    this.FCMRefreshTokenListener = FCM.on('refreshToken', (FCMToken) => updateFCMToken({FCMToken, token: this.props.currentUser.token}))
  }

  componentWillMount() {
    this.props.currentUser.startListeningToFirebase((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.initializeTags((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.updateLocation()
    getDecryptedUserData({token: this.props.currentUser.token}, (res) => {
      this.props.updateCurrentUser({decryptedEmail: res.email, decryptedPhone: res.phone})
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newTab && !this.state.changingTab) {
      this.setState({
        changingTab: true,
        activeTab: nextProps.newTab
      }, () => Actions.refresh({newTab: null}))
    }

    if (null === nextProps.newTab && this.state.changingTab) {
      this.setState({changingTab: false})
    }
  }

  changeTab(newTab) {
    if (newTab === this.state.activeTab) return

    // If switching from active tab, updateTags
    if (this.state.activeTab === "Explore" && this.props.currentUser.wantString || this.props.currentUser.ownString) {
      updateUserTags({
        want: this.props.currentUser.wantString,
        own: this.props.currentUser.ownString,
        token: this.props.currentUser.token
      })

      this.props.currentUser.update({wantString: "", ownString: ""})
    }

    this.setState({activeTab: newTab})
  }

  render() {
    return (
      <View style={{flex: 1}}>

        { /* Header */ }
        <Header activeTab={this.state.activeTab} changeTab={this.changeTab} {...this.props} showSideMenuButton showTabBar tabIndicators={this.state.tabIndicators} />

        { /* Inner content */ }
        <View style={styles.container}>
          {this.state.activeTab === "Broadcasts" ? <BroadcastsFeed {...this.props} />  : null}
          {this.state.activeTab === "Explore"    ? <ExploreFeed {...this.props} />     : null}
          {this.state.activeTab === "Me"         ? <MeFeed {...this.props} />          : null}
        </View>

        { /* New broadcast button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={colors.accent}
          style={styles.newBroadcastButtonWrap}
          onPress={() => {
            let {onboardingProgress} = this.props.currentUser.appFlags
            let needsBank = onboardingProgress === "need-bank"
            let needsMicrodeposits = onboardingProgress.indexOf("microdeposits") >= 0
            let needsVerification = onboardingProgress === "need-kyc"
            let needsVerificationDocument = onboardingProgress === "kyc-documentNeeded"
            let verificationIsPending = onboardingProgress !== "kyc-success" && onboardingProgress.indexOf("kyc-document") >= 0
            let title = ""
            let msg = ""
            let options = []

            console.log("")
            console.log("")
            console.log("--> needsBank", needsBank)
            console.log("--> needsMicrodeposits", needsMicrodeposits)
            console.log("--> needsVerification", needsVerification)
            console.log("--> needsVerificationDocument", needsVerificationDocument)
            console.log("--> verificationIsPending", verificationIsPending)
            console.log("")
            console.log("")

            if (needsBank) {
              title = `Bank Account Needed`
              msg = `You must add a bank account before you can create a broadcast.`
              options.push(
                {text: 'Cancel', style: 'cancel'},
                {text: 'Add Bank', onPress: Actions.BankAccounts}
              )
            } else if (needsMicrodeposits) {
              if ("microdeposits-initialized" === onboardingProgress) {
                title = "Bank Verification Needed"
                msg = "We'll notify you when your microdeposits have arrived and are ready for verification."
              }

              if ("microdeposits-deposited" === onboardingProgress) {
                title = "Bank Verification Needed"
                msg = "We made to small deposits to your bank account, verify them to create a broadcast."
                options.push(
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Verify Microdeposits',
                    onPress: () => Actions.MicrodepositOnboarding({
                      toggleModal: Actions.pop,
                      currentUser: this.props.currentUser
                    })
                  }
                )
              }

              if ("microdeposits-failed" === onboardingProgress) {
                title = `Bank Verification Needed`
                msg = `We couldn't send microdeposits with the bank information provided. Please try again.`
                options.push(
                  {text: 'Cancel', style: 'cancel'},
                  {text: 'Add Bank', onPress: Actions.BankAccounts}
                )
              }
            } else if (needsVerification) {
              title = `Account Verification Needed`
              msg = `You must verify your account before you can create a broadcast.`
              options.push(
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Verify Account',
                  onPress: () => Actions.KYCOnboardingView({currentUser: this.props.currentUser})
                }
              )
            } else if (needsVerificationDocument) {
              title = `Account Verification Needed`
              msg = `We need a photo ID to complete your account verification.`
              options.push(
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Upload Photo ID',
                  onPress: () => Actions.Camera({
                    showHeader: true,
                    headerProps: {showTitle: true, title: "Title", showBackButton: true},
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
                      }, (url, err) => {
                        if (err) console.log("--> Error thrown by uploadKYCDocument", err)
                      })
                    }
                  })
                }
              )
            } else if (verificationIsPending) {
              title = `Account Verification Pending`
              msg = `We'll notify you when your account has been verified so you can get casting!`
              options.push({text: 'OK'})
            }

            if (title) Alert.alert(title, msg, options)
            else Actions.BroadcastOnboardingFlow()
          }}>
          <Entypo name={"plus"} size={33} color={colors.snowWhite} />
        </TouchableHighlight>

      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentUser: (input) => dispatch(dispatchers.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Main)
