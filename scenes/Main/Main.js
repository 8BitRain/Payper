import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Alert} from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {Header, BroadcastsFeed, ExploreFeed, MeFeed} from '../../components'
import {updateFCMToken, updateUserTags} from '../../helpers/lambda'
import {notify} from '../../helpers/utils'
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
      activeTab: "Broadcasts"
    }

    this.changeTab = this.changeTab.bind(this)
  }

  componentDidMount() {
    FCM.requestPermissions()
    FCM.getFCMToken().then((FCMToken) => updateFCMToken({FCMToken, token: this.props.currentUser.token}))

    if (FCM.initialData) {
      FCM.initialData.opened_from_tray = true
      notify(FCM.initialData)
      setTimeout(() => {FCM.initialData = null})
    }

    this.notificationLisener = FCM.on('notification', (notification) => notify(notification))
    this.FCMRefreshTokenListener = FCM.on('refreshToken', (FCMToken) => updateFCMToken({FCMToken, token: this.props.currentUser.token}))
  }

  componentWillMount() {
    this.props.currentUser.startListeningToFirebase((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.initializeTags((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.updateLocation()
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
    }

    this.setState({activeTab: newTab})
  }

  render() {
    return (
      <View style={{flex: 1}}>

        { /* Header */ }
        <Header activeTab={this.state.activeTab} changeTab={this.changeTab} {...this.props} showSideMenuButton showTabBar />

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
            let needsBank = onboardingProgress === "need-bank" || onboardingProgress.indexOf("microdeposits") >= 0
            let needsVerification

            if (needsBank) {
              let title = `Bank Account Needed`
              let msg = `You must add a bank account before you can create a broadcast.`

              Alert.alert(title, msg, [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Add Bank', onPress: Actions.BankAccounts}
              ])
            } else if (needsVerification) {
              let title = `Account Verification Needed`
              let msg = `You must verify your account before you can create a broadcast.`

              Alert.alert(title, msg, [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Verify Account', onPress: () => Actions.KYCOnboardingView({currentUser: this.props.currentUser})}
              ])
            } else {
              Actions.BroadcastOnboardingFlow()
            }
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
