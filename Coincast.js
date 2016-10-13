// Dependencies
import React from 'react';
import { View } from 'react-native';
import { Scene, Reducer, Router, Modal } from 'react-native-router-flux';
import Error from './components/Error';

// Modules
import SplashViewContainer from './modules/Splash/SplashViewContainer';
import LandingScreenContainer from './modules/LandingScreen/LandingScreenContainer';
import MainViewContainer from './modules/Main/MainViewContainer';
import BetaLandingScreenView from './modules/BetaLandingScreen/BetaLandingScreenView';
import UserOnboardingViewContainer from './modules/UserOnboarding/UserOnboardingViewContainer';
import BankOnboardingView from './modules/BankOnboarding/BankOnboardingView';

const reducerCreate = (params) => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    console.log("ACTION:", action);
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
  render() {
    return (
      <Router key={Math.random()} createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar hideTabBar>

            <Scene initial key="SplashViewContainer" type="replace" component={SplashViewContainer} title="SplashViewContainer" panHandlers={null} />
            <Scene key="LandingScreenContainer" type="replace" component={LandingScreenContainer} title="LandingScreenContainer" panHandlers={null} />
            <Scene key="BankOnboardingView" type="replace" component={BankOnboardingView} title="BankOnboardingView" panHandlers={null} />
            <Scene key="MainViewContainer" type="replace" component={MainViewContainer} title="MainViewContainer" panHandlers={null} />
            <Scene key="BetaLandingScreenView" type="replace" component={BetaLandingScreenView} title="BetaLandingScreenView" panHandlers={null} />
            <Scene key="UserOnboardingViewContainer" type="replace" component={UserOnboardingViewContainer} title="UserOnboardingViewContainer" panHandlers={null} />

          </Scene>
          <Scene key="error" component={Error}/>
        </Scene>
      </Router>
    );
  }
}
