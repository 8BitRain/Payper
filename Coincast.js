// Dependencies
import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Scene, Reducer, Router, Modal, Actions, Route} from 'react-native-router-flux'
import Error from './components/Error'
import Button from "react-native-button";

// Custom components
import LandingView from './components/LandingView'
import LandingScreenView from './modules/LandingScreen/LandingScreenView'
import CreateAccountContainer from './modules/CreateAccountTwo/CreateAccountContainer'
import CreateAccountView from './modules/CreateAccount/CreateAccountView'
import TrackingContainer from './modules/Tracking/TrackingContainer'
import Header from './components/Header/Header'
import ArrowNavDouble from './components/Navigation/Arrows/ArrowDouble'

// Individual create account pages
// import Email from "./modules/CreateAccount/Pages"
// import FirstName from "./modules/CreateAccount/Pages"
// import LastName from "./modules/CreateAccount/Pages"
// import Password from "./modules/CreateAccount/Pages"
// import PhoneNumber from "./modules/CreateAccount/Pages"
// import Summary from "./modules/CreateAccount/Pages"
// import {Email, FirstName, LastName, Password, PhoneNumber, Summary} as Pages from "./modules/CreateAccount/Pages"
import LandingPage from './TestModules/LandingPage';
import Main from './TestModules/Main';
import POne from './TestModules/Pages/POne';
import PTwo from './TestModules/Pages/PTwo';
import PThree from './TestModules/Pages/PThree';

import Email from './Modules/CreateAccountTwo/Pages/Email';
import Password from './Modules/CreateAccountTwo/Pages/Password';

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
      <Router getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal}>
          <Scene key="root" hideNavBar hideTabBar>

            <Scene key="Email" component={Email} initial={true} />
            <Scene key="Password" component={Password} />

          </Scene>
        </Scene>
      </Router>
    );
  }
}

// <Scene key="modal" component={Modal} >
//   <Scene key="root" hideNavBar hideTabBar>
//
//     { /* Main app flow */ }
//     <Scene key="landingView" component={LandingView} title="LandingView"  initial={true} />
//     <Scene key="TrackingContainer" component={TrackingContainer} title="TrackingContainer" />
//     <Scene key="CreateAccountViewContainer" component={CreateAccountViewContainer} title="CreateAccountViewContainer" />
//
//     { /* Testing new routing architecture */ }
//
//     { /* Individual component test views */ }
//     <Scene key="LandingScreenView" component={LandingScreenView} title="LandingScreenView" />
//     <Scene key="Header" component={Header} title="Header" />
//     <Scene key="ArrowNavDouble" component={ArrowNavDouble} title="ArrowNavDouble" />
//
//   </Scene>
//   <Scene key="error" component={Error}/>
// </Scene>
// </Router>
