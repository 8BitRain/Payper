// Dependencies
import React from 'react';
import { AppState } from 'react-native';
import { Scene, Reducer, Router, Modal } from 'react-native-router-flux';
import Mixpanel from 'react-native-mixpanel';
import Error from './components/Error';

// Modules
import SplashViewContainer from './modules/Splash/SplashViewContainer';
import BetaLandingScreenView from './modules/BetaLandingScreen/BetaLandingScreenView';
import LandingScreenViewContainer from './modules/LandingScreen/LandingScreenViewContainer';
import MainViewContainer from './modules/Main/MainViewContainer';
import UserOnboardingViewContainer from './modules/UserOnboarding/UserOnboardingViewContainer';
import BankOnboardingView from './modules/BankOnboarding/BankOnboardingView';


// TODO: REMOVE
import MicrodepositOnboarding from './components/MicrodepositOnboarding/MicrodepositOnboarding';


const reducerCreate = (params) => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    // console.log("ACTION:", action);
    return defaultReducer(state, action);
  }
};

const getSceneStyle = function(props, computedProps) {
  const style = {
    flex: 1,
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
  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  handleAppStateChange(state) {
    if (state === 'inactive') return;
    else if (state === 'background') Mixpanel.track('Session Duration');
    else if (state === 'active') Mixpanel.timeEvent('Session Duration');
  }

  componentWillMount() {
    Mixpanel.sharedInstanceWithToken('507a107870150092ca92fa76ca7c66d6');
    Mixpanel.timeEvent('Session Duration');
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    return (
      <Router key={Math.random()} createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar hideTabBar>

            <Scene initial
              component={SplashViewContainer}
              key="SplashViewContainer"
              type="replace"
              panHandlers={null} />

            <Scene
              component={BetaLandingScreenView}
              key="BetaLandingScreenView"
              type="replace"
              panHandlers={null} />

            <Scene
              component={LandingScreenViewContainer}
              key="LandingScreenViewContainer"
              type="replace"
              panHandlers={null} />

            <Scene
              component={BankOnboardingView}
              key="BankOnboardingView"
              type="replace"
              panHandlers={null} />

            <Scene
              component={MainViewContainer}
              key="MainViewContainer"
              type="replace"
              panHandlers={null} />

            <Scene
              component={UserOnboardingViewContainer}
              key="UserOnboardingViewContainer"
              type="replace"
              panHandlers={null} />

            { /* TODO: REMOVE
            <Scene initial
              component={MicrodepositOnboarding}
              key="UserOnboardingViewContainer"
              type="replace"
              panHandlers={null} /> */ }

          </Scene>
          <Scene key="error" component={Error}/>
        </Scene>
      </Router>
    );
  }
}
