// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';
import Entypo from 'react-native-vector-icons/Entypo'

// Stylesheets
import colors from '../../styles/colors';
const styles = StyleSheet.create({
  footerWrap: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
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
  }
});

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: 'myPayments' }
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={colors.accent}
        onPress={() => this.props.callbackPay()}>
        <View style={{
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
        }}>

        <Entypo style={[styles.iconSettings, {marginLeft: 3.5}]} name="credit" size={30} color={colors.white} />

        </View>
      </TouchableHighlight>
    );
  }
};

export default Footer;
