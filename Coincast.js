// Dependencies
import React from 'react';
import { AppRegistry, Navigator, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Scene, Reducer, Router, Modal, Actions } from 'react-native-router-flux';
import Error from './components/Error';
import * as Async from './helpers/Async';

// Modules
import LandingScreenView from './modules/LandingScreen/LandingScreenView';
import SplashView from './modules/Splash/SplashView';
import CreateAccountViewContainer from './modules/CreateAccount/CreateAccountViewContainer';
import CreatePaymentViewContainer from './modules/CreatePayment/CreatePaymentViewContainer';
import SignInViewContainer from './modules/SignIn/SignInViewContainer';
import MainViewContainer from './modules/Main/MainViewContainer';
import BankOnboardingContainer from './modules/BankOnboarding/BankOnboardingContainer';

// Test modules
import LandingView from './components/LandingView';
import FirebaseBindingViewContainer from './modules/FirebaseBinding/FirebaseBindingViewContainer';

const reducerCreate = (params) => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    console.log("ACTION:", action);
    return defaultReducer(state, action);
  }
};

// define this based on the styles/dimensions you use
import colors from './styles/colors';
const getSceneStyle = function (props, computedProps) {
  const style = {
    flex: 1,
    backgroundColor: colors.icyBlue,
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
// Async.set('session_token', "");
// require('firebase').auth().signOut();


console.log('test');
export default class Coincast extends React.Component {

  render() {
    return (
      <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar hideTabBar>

            { /* Main app flow */ }
            <Scene key="SplashView" component={SplashView} title="SplashView" initial />
            <Scene key="LandingScreenView" component={LandingScreenView} title="LandingScreenView" />
            <Scene key="SignInViewContainer" component={SignInViewContainer} title="SignInViewContainer" />
            <Scene key="CreateAccountViewContainer" component={CreateAccountViewContainer} title="CreateAccountViewContainer" />
            <Scene key="BankOnboardingContainer" component={BankOnboardingContainer} title="BankOnboardingContainer" />
            <Scene key="MainViewContainer" component={MainViewContainer} title="MainViewContainer" />
            <Scene key="CreatePaymentViewContainer" component={CreatePaymentViewContainer} title="CreatePaymentViewContainer" />

            { /* Testing */ }
            <Scene key="LandingView" component={LandingView} title="LandingView" />
            <Scene key="FirebaseBindingViewContainer" component={FirebaseBindingViewContainer} title="FirebaseBindingViewContainer" />

          </Scene>
          <Scene key="error" component={Error}/>
        </Scene>
      </Router>
    );
  }
}
