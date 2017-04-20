import React from 'react'
import codePush from 'react-native-code-push'
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst} from 'react-native-router-flux'
import {colors} from './globalStyles'
import {
  NavigationDrawer,
  Want,
  Own,
  Interests,
  Roullette,
  UserWants
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
  MyProfile,
  WantsAndOwnsOnboarding
} from './scenes'
import {
  IAVModal,
  FacebookLoginModal,
  BankAccountsModal,
  RenewalDateModal,
  SettingsModal,
  UserProfileModal,
  MyProfileModal,
  CameraModal,
  DisputesModal,
  MicrodepositOnboardingModal
} from './scenes/Modals'
import {
  InviteOnlyLander,
  Lander
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

import {setInAsyncStorage} from './helpers/asyncStorage'
// setInAsyncStorage('userData', '')

class Coincast extends React.Component {
  render() {
    return(
      <Router createReducer={reducerCreate} sceneStyle={{backgroundColor: colors.snowWhite}}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar={true}>

            { /* Linear Scenes */ }
            <Scene key="Splash"                   component={Splash}                  panHandlers={null} initial />
            <Scene key="InviteOnlyLander"         component={InviteOnlyLander}        panHandlers={null} />
            <Scene key="Lander"                   component={Lander}                  panHandlers={null} />
            <Scene key="KYCOnboardingView"        component={KYCOnboardingView}       panHandlers={null} />
            <Scene key="MicrodepositTooltip"      component={MicrodepositTooltip}     panHandlers={null} />
            <Scene key="BankAccountAdded"         component={BankAccountAdded}        panHandlers={null} />
            <Scene key="Want"                     component={Want}                    panHandlers={null} />
            <Scene key="Own"                      component={Own}                     panHandlers={null} />
            <Scene key="WantsAndOwnsOnboarding"   component={WantsAndOwnsOnboarding}  panHandlers={null} />

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
            <Scene key="Disputes" direction="vertical">
              <Scene key="DisputesModal" component={DisputesModal} schema="modal" title="Disputes" panHandlers={null} hideNavBar />
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
            <Scene key="UserProfile" direction="vertical">
              <Scene key="UserProfileModal" component={UserProfileModal} schema="modal" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="Camera" direction="vertical">
              <Scene key="CameraModal" component={CameraModal} schema="modal" panHandlers={null} hideNavBar />
            </Scene>
            <Scene key="MicrodepositOnboarding" direction="vertical">
              <Scene key="MicrodepositOnboardingModal" component={MicrodepositOnboardingModal} schema="modal" panHandlers={null} hideNavBar />
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
