// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';
import Entypo from 'react-native-vector-icons/Entypo'

import colors from '../../styles/colors';

// footer styles
const styles = StyleSheet.create({
  // Container for footer elements
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,

    flex: 1,
    flexDirection: 'row',
  },

  button: {
    flex: 0.33,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderBottomWidth: 0
  },

  text: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.richBlack,
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
        <Entypo style={styles.iconSettings} name="globe" size={20} color={(_this.state.active == "feed") ? colors.accent : colors.richBlack} />
        <Text style={[styles.text, {color: (_this.state.active == "feed") ? colors.accent : colors.richBlack}]}>Feed</Text>
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
        <Entypo style={styles.iconSettings} name="user" size={20} color={(_this.state.active == "myPayments") ? colors.accent : colors.richBlack} />
        <Text style={[styles.text, {color: (_this.state.active == "myPayments") ? colors.accent : colors.richBlack}]}>My Payments</Text>
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
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={colors.accent}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 65,
          height: 65,
          borderRadius: 32.5,
          borderWidth: 0.0,
          borderColor: colors.white,
          backgroundColor: colors.accent,
          shadowColor: colors.lightGrey,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.45,
          shadowRadius: 3.0
        }}
        onPress={() => this.props.callbackPay()}>

        <Entypo style={[styles.iconSettings, {marginLeft: 3.5}]} name="credit" size={30} color={colors.white} />

      </TouchableHighlight>
    );
  }
};

export default Footer;
