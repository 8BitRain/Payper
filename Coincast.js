// Dependencies
import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View, AsyncStorage} from 'react-native'
import {Scene, Reducer, Router, Modal, Actions} from 'react-native-router-flux'
import Error from './components/Error'
import Button from "react-native-button";
import * as Firebase from './services/Firebase';


// Custom components
import LandingView from './components/LandingView'
import ThankYouView from './components/ThankYouView'
import LandingScreenView from './modules/LandingScreen/LandingScreenView'
import SplashView from './modules/Splash/SplashView'
import CreateAccountViewContainer from './modules/CreateAccount/CreateAccountViewContainer'
import CreatePaymentViewContainer from './modules/CreatePayment/CreatePaymentViewContainer'
import SignInViewContainer from './modules/SignIn/SignInViewContainer'
import MainViewContainer from './modules/Main/MainViewContainer'
import Notifications from './modules/Notifications/Notifications'
import TrackingContainer from './modules/Tracking/TrackingContainer'
import BankOnboardingContainer from './modules/BankOnboarding/BankOnboardingContainer'
import Header from './components/Header/Header'
import ArrowNavDouble from './components/Navigation/Arrows/ArrowDouble'


const reducerCreate = (params) => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    console.log("ACTION:", action);
    return defaultReducer(state, action);
  }
};

// define this based on the styles/dimensions you use
const getSceneStyle = function (props, computedProps) {
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



// TODO
require('firebase').auth().signOut();



export default class Coincast extends React.Component {

  render() {
    return (
      <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar hideTabBar>

            <Scene key="landingView" component={LandingView} title="LandingView" />

            { /* Main app flow */ }
            <Scene key="SplashView" component={SplashView} title="SplashView" initial />
            <Scene key="landingView" component={LandingView} title="LandingView" />
            <Scene key="ThankYouView" component={ThankYouView} title="ThankYouView"></Scene>
            <Scene key="CreateAccountViewContainer" component={CreateAccountViewContainer} title="CreateAccountViewContainer" />
            <Scene key="CreatePaymentViewContainer" component={CreatePaymentViewContainer} title="CreatePaymentViewContainer" />
            <Scene key="SignInViewContainer" component={SignInViewContainer} title="SignInViewContainer" />
            <Scene key="MainViewContainer" component={MainViewContainer} title="MainViewContainer" />
            <Scene key="TrackingContainer" component={TrackingContainer} title="TrackingContainer" />
            <Scene key="Notifications" component={Notifications} title="Notifications" />
            <Scene key="BankOnboardingContainer" component={BankOnboardingContainer} title="BankOnboardingContainer" />


            { /* Individual component test views */ }
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
