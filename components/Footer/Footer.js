// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableHighlight} from "react-native";
import Button from "react-native-button";
import Entypo from "react-native-vector-icons/Entypo"

import colors from '../../styles/colors';

// footer styles
const styles = StyleSheet.create({
  // Container for footer elements
  footerWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,

    flex: 1,
    flexDirection: "row",
  },

  button: {
    flex: 0.33,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.darkGrey,
  },

  text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.icyBlue,
  },

  payButton: {

  },
});

// Return a 'FEED' button
function getFeedButton(callback) {
  return(
    <TouchableHighlight style={[styles.button, {borderRightWidth: 0.5}]} onPress={() => callback()}>
      <View>
        <Text style={styles.text}>FEED</Text>
      </View>
    </TouchableHighlight>
  );
};

// Return a 'TRACKING' button
function getTrackingButton(callback) {
  return(
    <TouchableHighlight style={[styles.button, {borderLeftWidth: 0.5}]} onPress={() => callback()}>
      <View>
        <Text style={styles.text}>TRACKING</Text>
      </View>
    </TouchableHighlight>
  );
};

// Return a pay button
function getPayButton(callback) {
  return(
    <TouchableHighlight style={[styles.button, {borderLeftWidth: 0.5}]} onPress={() => callback()}>
      <View style={styles.payButton}>
        <Text>PAY</Text>
      </View>
    </TouchableHighlight>
  );
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <View style={[styles.footerWrap]}>
        { getFeedButton(this.props.callbackFeed) }
        { getPayButton(this.props.callbackPay) }
        { getTrackingButton(this.props.callbackTracking) }
      </View>
    );
  }
};

export default Footer;
