import React from 'react'
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst} from 'react-native-router-flux'
import {
  NavigationDrawer
} from './components'
import {
  Splash,
  InviteOnlyLander,
  Lander,
  FacebookLoginModal,
  BankAccountsModal,
  SettingsModal,
  NewBroadcastModal,
  BroadcastDetailsModal,
  Main,
  Broadcasts,
  Explore,
  Me
} from './scenes'

const reducerCreate = (params) => {
  const defaultReducer = Reducer(params)
  return (state, action) => {
    // console.log("ACTION:", action)
    return defaultReducer(state, action)
  }
}

export default class Coincast extends React.Component {
  render() {
    return(
      <Router createReducer={reducerCreate} sceneStyle={{backgroundColor:'#F7F7F7'}}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar={true}>

            { /* Linear Scenes */ }
            <Scene key="Splash"           component={Splash}           panHandlers={null} initial={true} />
            <Scene key="InviteOnlyLander" component={InviteOnlyLander} panHandlers={null} />
            <Scene key="Lander"           component={Lander}           panHandlers={null} />

            { /* Drawer/Tab Scenes */ }
            <Scene key="Main" component={NavigationDrawer} open={false}>
              <Scene key="TabScenes" tabs={true}>
                <Scene key="Broadcasts" component={Main} title="Broadcasts" hideTabBar hideNavBar panhandlers={null} initial={true} />
                <Scene key="Explore"    component={Main} title="Explore"    hideTabBar hideNavBar panhandlers={null} />
                <Scene key="Me"         component={Main} title="Me"         hideTabBar hideNavBar panhandlers={null} />
              </Scene>
            </Scene>

            { /* Modal Scenes */ }
            <Scene key="FacebookLogin" direction="vertical">
              <Scene key="FacebookLoginModal" component={FacebookLoginModal} schema="modal" panHandlers={null} title="Facebook Login" hideNavBar />
            </Scene>
            <Scene key="Settings" direction="vertical">
              <Scene key="SettingsModal" component={SettingsModal} schema="modal" title="Settings" />
            </Scene>
            <Scene key="BankAccounts" direction="vertical">
              <Scene key="BankAccountsModal" component={BankAccountsModal} schema="modal" title="Bank Accounts" />
            </Scene>
            <Scene key="NewBroadcast" direction="vertical">
              <Scene key="NewBroadcastModal" component={NewBroadcastModal} schema="modal" title="New Broadcast" />
            </Scene>
            <Scene key="BroadcastDetails">
              <Scene key="BroadcastDetailsModal" component={BroadcastDetailsModal} schema="modal" title="Broadcast Details" hideNavBar />
            </Scene>
          </Scene>

          { /* Included in react-native-router-flux */ }
          <Scene key="error" component={Error} />
        </Scene>
      </Router>
    )
  }
}
