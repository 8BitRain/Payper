import React from 'react'
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import Launch from './exampleComponents/Launch'
import Register from './exampleComponents/Register'
import Login from './exampleComponents/Login'
import Login2 from './exampleComponents/Login2'
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux'
import Error from './exampleComponents/Error'
import Home from './exampleComponents/Home'
import TabView from './exampleComponents/TabView'

import {
  NavigationDrawer
} from './components'

import {
  Splash,
  InviteOnlyLander,
  Lander,
  FacebookLoginModal,
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
            <Scene key="Main" component={NavigationDrawer} open={false} >
              <Scene key="TabScenes" tabs={true}>
                <Scene key="Broadcasts" component={Main} title="Broadcasts" hideTabBar hideNavBar panhandlers={null} initial={true} />
                <Scene key="Explore"    component={Main} title="Explore"    hideTabBar hideNavBar panhandlers={null} />
                <Scene key="Me"         component={Main} title="Me"         hideTabBar hideNavBar panhandlers={null} />
              </Scene>
            </Scene>

            { /* Modal Scenes */ }
            <Scene key="FacebookLoginModal" direction="vertical">
              <Scene key="FBLoginModal" component={FacebookLoginModal} schema="modal" title="Facebook Login" />
            </Scene>

            { /*
            <Scene key="register" component={Register} title="Register" />
            <Scene key="register2" component={Register} title="Register2" duration={1} />
            <Scene key="home" component={Home} title="Replace" type={ActionConst.REPLACE} />
            <Scene key="launch" component={Launch} title="Launch" initial={true} style={{flex:1, backgroundColor:'transparent'}} />
            <Scene key="login" direction="vertical">
              <Scene key="loginModal" component={Login} schema="modal" title="Login" />
              <Scene key="loginModal2" hideNavBar={true} component={Login2} title="Login2" />
            </Scene>
            <Scene key="tabbar" tabs={true}>
              <Scene key="tab1" title="Tab #1" icon={TabIcon} navigationBarStyle={{backgroundColor:'red'}} titleStyle={{color:'white'}}>
                <Scene key="tab1_1" component={TabView} title="Tab #1_1" onRight={()=>alert("Right button")} rightTitle="Right" />
                <Scene key="tab1_2" component={TabView} title="Tab #1_2" titleStyle={{color:'black'}} />
              </Scene>
              <Scene key="tab2" initial={true} title="Tab #2" icon={TabIcon}>
                <Scene key="tab2_1" component={TabView} title="Tab #2_1" onLeft={()=>alert("Left button!")} leftTitle="Left" />
                <Scene key="tab2_2" component={TabView} title="Tab #2_2" />
              </Scene>
              <Scene key="tab3" component={TabView} title="Tab #3" hideTabBar={true} icon={TabIcon} />
              <Scene key="tab4" component={TabView} title="Tab #4" hideNavBar={true} icon={TabIcon} />
              <Scene key="tab5" component={TabView} title="Tab #5" icon={TabIcon} />
            </Scene>
          */ }
          </Scene>

          <Scene key="error" component={Error} />
        </Scene>
      </Router>
    )
  }
}
