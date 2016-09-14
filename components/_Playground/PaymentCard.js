// Dependencies
import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableHighlight, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';

// Components
import Avatar from './Avatar';

// Helpers
import * as Timestamp from '../../helpers/Timestamp';

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
          <Avatar
            user={{
              profile_pic: this.props.payment.sender_pic,
              first_name: this.props.payment.sender_name.split(" ")[0],
              last_name: this.props.payment.sender_name.split(" ")[1],
            }}
            width={48}
            height={48} />
          <Text style={typography.name}>
            { (this.props.payment.sender_name.split(" ").length > 1)
                ? this.props.payment.sender_name.split(" ")[0] + "\n" + this.props.payment.sender_name.split(" ")[1]
                : this.props.payment.sender_name }
          </Text>
        </View>

        { /* Bottom half */ }
        <View style={wrappers.bottom}>
          <View style={wrappers.info}>
            <Text style={typography.duration}>
              { "$" + this.props.payment.amount + " per month for " + this.props.payment.payments + " months" }
            </Text>
            <Text style={typography.info}>
              { "Purpose: " + this.props.payment.purpose }
            </Text>
            <Text style={typography.info}>
              { "Next Payment: " + Timestamp.calendarize(this.props.payment.nextPayment) }
            </Text>
          </View>
          <View style={wrappers.progressBar}>
            <View style={[progressBar.inner, {flex: this.props.payment.paymentsMade / this.props.payment.payments}]}></View>
            <View style={{flex: 1 - this.props.payment.paymentsMade / this.props.payment.payments}}></View>
            <View style={{ position: 'absolute', justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0, borderWidth: (borders) ? 1.0 : 0.0, borderColor: 'red' }}>
              <Text style={typography.progressBar}>{ this.props.payment.paymentsMade } of { this.props.payment.payments }</Text>
            </View>
          </View>
        </View>

        { /* Notice (if any) */
          (this.props.payment.notice)
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
          <View style={[panes.general, { backgroundColor: "rgba(255, 255, 255, " + 0.45 / this.props.paneCounter + ")" }]} />
          <PaymentCardContent {...this.props} />
        </View>

      </TouchableHighlight>
    );
  }
};

const wrappers = StyleSheet.create({
  paymentCard: {
    width: dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentCardContent: {
    flex: 1.0,
    width: dimensions.width,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    width: dimensions.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    width: dimensions.width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  info: {
    paddingBottom: 15,
  },
  notice: {
    height: 40,
    backgroundColor: colors.alertRed,
  },
  progressBar: {
    width: dimensions.width * 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 22,
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 15,
    borderColor: colors.richBlack,
    borderWidth: 0.5,
    backgroundColor: 'transparent',
  },
});

const progressBar = StyleSheet.create({
  inner: {
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});

const typography = StyleSheet.create({
  info: {
    fontFamily: 'Roboto',
    color: colors.richBlack,
    padding: 2,
  },
  duration: {
    fontFamily: 'Roboto',
    color: colors.richBlack,
    padding: 5,
    borderRadius: 2,
    marginBottom: 5,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  name: {
    fontFamily: 'Roboto',
    fontSize: 18.5,
    fontWeight: '200',
    color: colors.richBlack,
    paddingLeft: 15,
  },
  progressBar: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.white,
    alignSelf: 'flex-end',
    paddingRight: 14,
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'yellow',
  }
});

const panes = StyleSheet.create({
  general: {
    flex: 1.0,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
});

export default PaymentCard;
