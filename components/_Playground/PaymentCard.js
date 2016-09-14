// Dependencies
import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableHighlight, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';

// Should we show container borders?
const borders = false;

// Window dimensions
const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

class PaymentCardContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={wrappers.paymentCardContent}>

        { /* Top half */ }
        <View style={wrappers.top}>

        </View>

        { /* Bottom half */ }
        <View style={wrappers.bottom}>

        </View>

        { /* Notice (if any) */
          (!this.props.payment.notice)
            ? <View style={wrappers.notice} />
            : null }

      </View>
    );
  };
};

class PaymentCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={1.0}
        underlayColor={'transparent'}
        onPress={() => console.log("Pressed payment card")}>

        <View style={wrappers.paymentCard}>
          <View style={[panes.light, { backgroundColor: "rgba(255, 255, 255, " + 0.45 / this.props.paneCounter + ")" }]} />
          <Payment {...this.props} />
        </View>

      </TouchableHighlight>
    );
  }
};

const wrappers = StyleSheet.create({
  paymentCard: {
    width: dimensions.width,
  },
  paymentCardContent: {
    flex: 1.0,
    padding: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentCardTop: {

  },
  paymentCardBottom: {

  },
  notice: {
    height: 40,
    backgroundColor: colors.alertRed,
  },
});

const panes = StyleSheet.create({
  light: {
    flex: 1.0,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  medium: {
    flex: 1.0,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dark: {
    flex: 1.0,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default PaymentCard;
