import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions, AsyncStorage} from 'react-native-router-flux';

// Helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";

// Custom stylesheets
import containers from "../../styles/containers";
import typography from "../../styles/typography";
import colors from "../../styles/colors";

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

// Partial components
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'tracking',

      // Props to be passed to the Header
      headerProps: {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": true,
          "closeIcon": false,
        },
        index: null,
        numCircles: null,
      },
    }
  }

  componentWillMount() {
    // Check if the user was successfully stored to AsyncStorage
    try {
      AsyncStorage.getItem('@Store:user').then((val) => {
        console.log("=-=-= Signed in user:");
        console.log(val);
      });
    } catch (err) {
      console.log("=-=-= Error reading from AsyncStorage:");
      console.log(err);
      console.log("=-=-=");
    }
  }

  render() {

    switch (this.state.tab) {
      case "tracking":
        return (
          <View style={{flex: 1, backgroundColor: 'red'}}>

            <Header
              dark
              headerProps={this.state.headerProps} />

            <Footer
              callbackFeed={() => console.log("FEED")}
              callbackTracking={() => console.log("TRACKING")} />
          </View>
        );
      break;
      case "feed":

      break;
      case "empty":

      break;
    }
  }
}

export default Main;
