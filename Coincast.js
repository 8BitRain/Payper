// Dependencies
import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Scene, Reducer, Router, Modal, Actions} from 'react-native-router-flux'
import Error from './components/Error'
import Button from "react-native-button";

// Custom components
import LandingView from './components/LandingView'
import LandingScreenView from './modules/LandingScreen/LandingScreenView'
import CreateAccountViewContainer from './modules/OnBoarding_CreateAccount/CreateAccountViewContainer'
import Header from './components/Header/Header'
import ArrowNavDouble from './components/Navigation/Arrows/ArrowDouble'

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

// define this based on the styles/dimensions you use
const getSceneStyle = function (/* NavigationSceneRendererProps */ props, computedProps) {
  const style = {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};

export default class Coincast extends React.Component {
  render() {
    return (
      <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal} >
          <Scene key="root" hideNavBar hideTabBar>

            <Scene key="landingView" component={LandingView} title="LandingView"  initial={true} ></Scene>
            <Scene key="CreateAccountViewContainer" component={CreateAccountViewContainer} title="CreateAccountViewContainer" />
            <Scene key="LandingScreenView" component={LandingScreenView} title="LandingScreenView" />
            <Scene key="Header" component={Header} title="Header" />
            <Scene key="ArrowNavDouble" component={ArrowNavDouble} title="ArrowNavDouble" />

          </Scene>
          <Scene key="error" component={Error}/>
        </Scene>
      </Router>
    );
  }
}
