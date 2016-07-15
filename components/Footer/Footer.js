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
    top: 0,

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
    borderColor: colors.lightGrey,
  },

  text: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.darkGrey,
  },

  payButton: {

  },
});

// Return a 'FEED' button
function getFeedButton(_this, callback) {
  return(
    <TouchableHighlight
      activeOpacity={0.7}
      underlayColor={'transparent'}
      style={[styles.button]}
      onPress={() => { _this.setState({active: 'feed'}); callback(); }}>
      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Entypo style={styles.iconSettings} name="globe" size={20} color={(_this.state.active == "feed") ? colors.icyBlue : colors.darkGrey} />
        <Text style={[styles.text, {color: (_this.state.active == "feed") ? colors.icyBlue : colors.darkGrey}]}>Feed</Text>
      </View>
    </TouchableHighlight>
  );
};

// Return a 'TRACKING' button
function getTrackingButton(_this, callback) {
  return(
    <TouchableHighlight
      activeOpacity={0.7}
      underlayColor={'transparent'}
      style={[styles.button]}
      onPress={() => { _this.setState({active: 'myPayments'}); callback(); }}>
      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Entypo style={styles.iconSettings} name="user" size={20} color={(_this.state.active == "myPayments") ? colors.icyBlue : colors.darkGrey} />
        <Text style={[styles.text, {color: (_this.state.active == "myPayments") ? colors.icyBlue : colors.darkGrey}]}>My Payments</Text>
      </View>
    </TouchableHighlight>
  );
};

// Return a pay button
function getPayButton(callback) {
  return(
    <TouchableHighlight
      activeOpacity={0.7}
      underlayColor={'transparent'}
      style={[styles.button]}
      onPress={() => callback()}>
    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Entypo style={[styles.iconSettings]} name="credit" size={20} color={colors.green} />
      <Text style={[styles.text]}>New Payment</Text>
    </View>
    </TouchableHighlight>
  );
};

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'myPayments',
    }
  }
  render() {
    return(
      <View style={[styles.footerWrap]}>
        { getFeedButton(this, this.props.callbackFeed) }
        { getPayButton(this.props.callbackPay) }
        { getTrackingButton(this, this.props.callbackTracking) }
      </View>
    );
  }
};

export default Footer;
