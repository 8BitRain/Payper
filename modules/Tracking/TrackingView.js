import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";


const buttons = StyleSheet.create({
  paymentButton: {
    flexDirection: "column",
    flex: .5,
    alignItems: "center",
    justifyContent: "center"
  }
});

const images = StyleSheet.create({
  paymentButton : {
    width: 64,
    height: 64
  }
});

const typo = StyleSheet.create({
  // General typography styles
  general: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "normal",
    color: "#fff"
  },

  // Varying font sizes (ex. "What's your email?")
  fontSizeTitle: { fontSize: 25 },
  fontSizeNote: { fontSize: 20 },
  fontSizeError: { fontSize: 15},

  textInput: {
    height: 40,
    backgroundColor: "transparent",
    padding: 10,
    paddingLeft: 0,
    color: "#fff"
  },

  // Helper styles
  marginLeft: { marginLeft: 20 },
  marginBottom: { marginBottom: 20 },
  marginTop: { marginBottom: 20 },
  marginRight: { marginBottom: 20 },
  marginSides: {
    marginLeft: 20,
    marginRight: 20
  },
  padLeft: { paddingLeft: 20 },
  padBottom: { paddingBottom: 20 },
  padTop: { paddingBottom: 20 },
  padRight: { paddingBottom: 20 }
});

const styles = StyleSheet.create({
  // Flex positioning
  container: {
    flex: 1
  },
  contentContainer: {
    flex: .5,
    justifyContent: "center",
  }
});

class TrackingEmpty extends React.Component {
   constructor(props) {
     super(props);
     this.animationProps = {
       fadeAnim: new Animated.Value(0) // init opacity 0
     };
   }
   componentDidMount() {
     Animations.fadeIn(this.animationProps);
   }
   render() {
     return (
       <Animated.View style={[styles.container, {opacity: this.animationProps.fadeAnim}]}>
        <View style={styles.contentContainer}>
         <Text style={[typo.fontSizeTitle, typo.marginTop, typo.marginBottom, typo.marginSides]}>Click here to start using Coincast Payments!</Text>
         <Button style={buttons.paymentButton}> <Image style={images.paymentButton} source={require('./assets/money-button64.png')} /></Button>
        </View>
       </Animated.View>
     );
   }
 }

const TrackingView = React.createClass({
  render() {
    return(
      <TrackingEmpty  />
    );
  }
});

export default TrackingView;
