import React from 'react'
import codePush from 'react-native-code-push'
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst} from 'react-native-router-flux'
import {colors} from './globalStyles'
import {
  NavigationDrawer
} from './components'
import {
  Splash,
  BroadcastOnboardingFlowRoot,
  Main,
  Broadcasts,
  Explore,
  Me,
  KYCOnboardingView,
  MicrodepositTooltip,
  MyProfile
} from './scenes'
import {
  IAVModal,
  FacebookLoginModal,
  BankAccountsModal,
  RenewalDateModal,
  SettingsModal,
  UserProfileModal,
  MyProfileModal
} from './scenes/Modals'
import {
  InviteOnlyLander,
  Lander,
  PromoLander
} from './scenes/Landers'
import {
  BankAccountAdded,
  VerifiedIdentity
} from './scenes/Rewards'
import {
  AdminBroadcastView,
  JoinedBroadcastView,
  UnjoinedBroadcastView
} from './components/Broadcasts'

const reducerCreate = (params) => {
  const defaultReducer = Reducer(params)
  return (state, action) => {
    // console.log("ACTION:", action)
    return defaultReducer(state, action)
  }
}

class Coincast extends React.Component {
  render() {
    return(
      <Router createReducer={reducerCreate} sceneStyle={{backgroundColor: colors.snowWhite}}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar={true}>

            { /* Linear Scenes */ }
            <Scene key="Splash"               component={Splash}              panHandlers={null} />
            <Scene key="PromoLander"          component={PromoLander}         panHandlers={null} />
            <Scene key="InviteOnlyLander"     component={InviteOnlyLander}    panHandlers={null} />
            <Scene key="Lander"               component={Lander}              panHandlers={null} />
            <Scene key="KYCOnboardingView"    component={KYCOnboardingView}   panHandlers={null} />
            <Scene key="MicrodepositTooltip"  component={MicrodepositTooltip} panHandlers={null} />

            { /* Drawer/Tab Scenes */ }
            <Scene key="Main" component={NavigationDrawer} open={false}>
              <Scene key="MainView" component={Main} title="MainView" hideTabBar hideNavBar panhandlers={null} />
            </Scene>

            { /* Modal Scenes */ }
            <Scene key="FacebookLogin" direction="vertical">
              <Scene key="FacebookLoginModal" component={FacebookLoginModal} schema="modal" title="Facebook Login" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="Settings" direction="vertical">
              <Scene key="SettingsModal" component={SettingsModal} schema="modal" title="Settings" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="RenewalDate" direction="vertical">
              <Scene key="RenewalDateModal" component={RenewalDateModal} schema="modal" title="Settings" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="BankAccounts" direction="vertical">
              <Scene key="BankAccountsModal" component={BankAccountsModal} schema="modal"  title="Bank Accounts" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="IAV" direction="vertical">
              <Scene key="IAVModal" component={IAVModal} schema="modal" panHandlers={null} title="IAV" hideNavBar />
            </Scene>
            <Scene key="BroadcastOnboardingFlow" direction="vertical">
              <Scene key="BroadcastOnboardingFlowRoot" component={BroadcastOnboardingFlowRoot} schema="modal" title="New Broadcast" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="MyProfile" direction="vertical">
              <Scene key="MyProfileModal" component={MyProfileModal} schema="modal" title="My Profile" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="UserProfile" direction="vertical" initial>
              <Scene key="UserProfileModal" component={UserProfileModal} schema="modal" panHandlers={null} hideNavBar
                user={{
                  firstName: "Brady",
                  lastName: "Sheridan",
                  username: "@Brady-Sheridan",
                  profilePic: "https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/17022387_1372970839390041_35582023932744800_n.jpg?oh=89f12fde03130040435030ddeda9f0c6&oe=5950F4FA",
                  avgRating: 3,
                  numRatings: 18
                }} />
            </Scene>

            { /* Broadcast Modals */ }
            <Scene key="AdminBroadcast">
              <Scene key="AdminBroadcastModal" component={AdminBroadcastView} schema="modal" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="JoinedBroadcast">
              <Scene key="JoinedBroadcastModal" component={JoinedBroadcastView} schema="modal" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="UnjoinedBroadcast">
              <Scene key="UnjoinedBroadcastModal" component={UnjoinedBroadcastView} schema="modal" panHandlers={null} hideNavBar />
            </Scene>

            { /* Reward Modals */ }
            <Scene key="BankAccountAdded">
              <Scene key="BankAccountAddedModal" component={BankAccountAdded} schema="modal" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="VerifiedIdentity">
              <Scene key="VerifiedIdentityModal" component={VerifiedIdentity} schema="modal" panHandlers={null} hideNavBar />
            </Scene>

          </Scene>

          <Scene key="error" component={Error} />

        </Scene>
      </Router>
    )
  }
}

Coincast = codePush(Coincast)

module.exports = Coincast
