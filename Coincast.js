// Dependencies
import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View, AsyncStorage} from 'react-native'
import {Scene, Reducer, Router, Modal, Actions} from 'react-native-router-flux'
import Error from './components/Error'
import Button from "react-native-button";
import Firebase from 'firebase';

// Custom components
import LandingView from './components/LandingView'
import LandingScreenView from './modules/LandingScreen/LandingScreenView'
import CreateAccountViewContainer from './modules/CreateAccount/CreateAccountViewContainer'
import CreatePaymentViewContainer from './modules/CreatePayment/CreatePaymentViewContainer'
import TrackingContainer from './modules/Tracking/TrackingContainer'
import Header from './components/Header/Header'
import ArrowNavDouble from './components/Navigation/Arrows/ArrowDouble'

// POST test components
import POSTPayment from './_MOCKDB/TestComponents/POSTPayment';
import POSTCustomer from './_MOCKDB/TestComponents/POSTCustomer';

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


const usersRef = new Firebase("https://coincast.firebaseio.com/usernames");

/**
  *   Each time a user is added to Firebase, persist it to async storage
  *   (this doubles as initialization)
**/
usersRef.on("child_added", async function(childSnapshot, prevChildKey) {
  console.log("Got: " + childSnapshot.val());
  console.log("Key: " + childSnapshot.key());

  // Persist user data to async storage
  try {
    console.log("ADDING: " + childSnapshot.key());
    await AsyncStorage.setItem('@Users:' + childSnapshot.key(), JSON.stringify(childSnapshot.val()), async function() {
      console.log("Updated @Users:");


      try {
        const value = await AsyncStorage.getItem('@Store:users');
        if (value !== null){
          // We have data!!
          console.log(JSON.parse(value));
        }
      } catch (error) {
        // Error retrieving data
        console.log("ASYNC ERROR: " + error);
      }


    });
  } catch (error) {
    console.log("Error persisting data to async storage: " + error);
  }
}, function (errorObject) {
  console.log("The Firebase read failed: " + errorObject.code);
});

/**
  *   Each time a user is added to Firebase, persist it to async storage
  *   (this doubles as initialization)
**/
usersRef.on("child_removed", async function(oldChildSnapshot) {
  console.log("Removing user " + oldChildSnapshot.key());

  // Remove user data from async storage
  try {
    await AsyncStorage.removeItem('@Users:' + oldChildSnapshot.key());
  } catch (error) {
    console.log("Error removing data from async storage: " + error);
  }
}, function (errorObject) {
  console.log("The Firebase read failed: " + errorObject.code);
});


export default class Coincast extends React.Component {

  render() {

    // this.test();

    return (
      <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal} >
          <Scene key="root" hideNavBar hideTabBar>

            { /* Main app flow */ }
            <Scene key="landingView" component={LandingView} title="LandingView" initial={true} />
            <Scene key="CreateAccountViewContainer" component={CreateAccountViewContainer} title="CreateAccountViewContainer" />
            <Scene key="CreatePaymentViewContainer" component={CreatePaymentViewContainer} title="CreatePaymentViewContainer" />
            <Scene key="TrackingContainer" component={TrackingContainer} title="TrackingContainer" />

            { /* Testing POST requests */ }
            <Scene key="POSTPayment" component={POSTPayment} title="POSTPayment" initial={false} />
            <Scene key="POSTCustomer" component={POSTCustomer} title="POSTCustomer" initial={false} />

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
