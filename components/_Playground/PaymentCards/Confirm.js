// Dependencies
import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableHighlight, Platform, ActionSheetIOS, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../styles/colors';
import Entypo from 'react-native-vector-icons/Entypo'
import Alert from '../../../helpers/Alert';

// Components
import Avatar from '../Avatar';

// Helpers
import * as Timestamp from '../../../helpers/Timestamp';

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
    this.actionSheetOptions = ['Cancel Payment Series', 'Nevermind'];
    this.acceptRejectHeight = new Animated.Value(50);
    this.progressBarHeight = new Animated.Value(0);
    this.progressBarOffsetBottom = new Animated.Value(0);
  }

  _toggleActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: "$" + this.props.payment.amount + " per month - " + this.props.payment.purpose,
      options: this.actionSheetOptions,
      cancelButtonIndex: 1
    },
    (buttonIndex) => {
      console.log(this.actionSheetOptions[buttonIndex]);
    });
  }

  _toggleCancelAlert() {
    Alert.alert({
      title: "Are you sure you'd like to cancel this payment series?",
      message: "$" + this.props.payment.amount + " per month for " + this.props.payment.payments + " months\nPurpose: " + this.props.payment.purpose,
      cancelMessage: "Nevermind",
      confirmMessage: "Cancel",
      cancel: () => {
        console.log("Nevermind");
      },
      confirm: () => {
        console.log("Cancelling payment series...");
      },
    });
  }

  _accept() {
    Animated.sequence([
      Animated.timing(this.acceptRejectHeight, {
        toValue: 0,
        duration: 125,
      }),
      Animated.parallel([
        Animated.timing(this.progressBarHeight, {
          toValue: 22,
          duration: 125,
        }),
        Animated.timing(this.progressBarOffsetBottom, {
          toValue: 20,
          duration: 50,
        }),
      ]),
    ]).start();

    // (...)
    // Change this row's sectionTitle to "New"
  }

  render() {
    return(
      <View style={wrappers.paymentCardContent}>
        { /* Top half */ }
        <View style={wrappers.top}>
          <View style={wrappers.topLeft}>
            <Avatar
              user={{
                profile_pic: this.props.payment.sender_pic,
                first_name: (this.props.payment.flow == "outgoing") ? this.props.payment.recip_name.split(" ")[0] : this.props.payment.sender_name.split(" ")[0],
                last_name: (this.props.payment.flow == "outgoing") ? this.props.payment.recip_name.split(" ")[1] : this.props.payment.sender_name.split(" ")[1],
              }}
              width={58}
              height={58} />
          </View>
          <View style={wrappers.topRight}>
            <Text style={typography.name}>
              { (this.props.payment.flow == "outgoing") ? this.props.payment.recip_name : this.props.payment.sender_name }
            </Text>
            <Text style={typography.info}>
              { "$" + this.props.payment.amount + " per month for " + this.props.payment.payments + " months" }
            </Text>
            <Text style={typography.info}>
              { "Purpose: " + this.props.payment.purpose }
            </Text>
            <Text style={typography.info}>
              { "Next Payment: " + Timestamp.calendarize(this.props.payment.nextPayment) }
            </Text>
          </View>
        </View>

        { /* Bottom half */ }
        <View style={wrappers.bottom}>

          { /* Accept and Reject buttons */ }
          <Animated.View style={{ height: this.acceptRejectHeight, overflow: "hidden" }}>
            <View style={{ flexDirection: 'row', width: dimensions.width }}>
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'rgba(0, 0, 0, 0.5)'}
                onPress={() => this.props.reject()}>

                <View style={{ height: 50, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.75)', width: dimensions.width * 0.5 }}>
                  <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', textAlign: 'center', color: colors.alertRed }}>
                    Reject
                  </Text>
                </View>

              </TouchableHighlight>

              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'rgba(0, 0, 0, 0.5)'}
                onPress={() => this._accept()}>

                <View style={{ height: 50, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.85)', width: dimensions.width * 0.5 }}>
                  <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', textAlign: 'center', color: colors.alertGreen }}>
                    Accept
                  </Text>
                </View>

              </TouchableHighlight>
            </View>
          </Animated.View>

          { /* Progress bar */ }
          <Animated.View style={[wrappers.progressBar, { marginBottom: this.progressBarOffsetBottom, height: this.progressBarHeight, overflow: 'hidden' }]}>
            <View style={[progressBar.inner, {flex: this.props.payment.paymentsMade / this.props.payment.payments}]}></View>
            <View style={{flex: 1 - this.props.payment.paymentsMade / this.props.payment.payments}}></View>
            <View style={{ position: 'absolute', justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0, borderWidth: (borders) ? 1.0 : 0.0, borderColor: 'red' }}>
              <Text style={typography.progressBar}>{ this.props.payment.paymentsMade } of { this.props.payment.payments }</Text>
            </View>
          </Animated.View>
        </View>

        { /* Notice (if any) */
          (this.props.payment.notice)
            ? <View style={wrappers.notice} />
            : null }

        { /* Menu toggle icon */ }
        <TouchableHighlight
          style={menu.toggleWrap}
          activeOpacity={0.775}
          underlayColor={'transparent'}
          onPress={() => this._toggleActionSheet()}>
          <Entypo name={"dots-three-horizontal"} size={20} color={"rgba(0, 0, 0, 0.8)"} />
        </TouchableHighlight>
      </View>
    );
  };
};

class ConfirmPaymentCard extends React.Component {
  constructor(props) {
    super(props);
    this.offsetLeft = new Animated.Value(0);
    this.offsetTop = new Animated.Value(0);
    this.height = new Animated.Value(180);

    this.state = {
      layoutInitialized: true,
      initialHeight: -1,
    };
  }

  _reject() {
    Animated.sequence([
      Animated.timing(this.offsetLeft, {
        toValue: -dimensions.width * 2,
        duration: 150,
        easing: Easing.cubic,
      }),
      Animated.timing(this.height, {
        toValue: 0,
        duration: 150,
        easing: Easing.cubic,
      }),
    ]).start(() => {
      this.props.reject();
    });
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={1.0}
        underlayColor={'transparent'}>

        <Animated.View style={{ height: this.height, marginLeft: this.offsetLeft, overflow: 'hidden' }}>
          { /* Payment card */ }
          <View style={wrappers.paymentCard}>
            <View style={[panes.general, { backgroundColor: 'rgba(255, 255, 255, ' + 0.45 / this.props.paneCounter + ')' }]} />
            <PaymentCardContent
              {...this.props}
              reject={() => this._reject()} />
          </View>
        </Animated.View>
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
    width: dimensions.width * 0.9,
    paddingTop: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flex: 0.5,
    width: dimensions.width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeft: {
    flex: 0.3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'red',
    paddingLeft: 15,
  },
  topRight: {
    flex: 0.7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'blue',
  },
  bottom: {
    flex: 0.5,
    width: dimensions.width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 17,
  },
  notice: {
    height: 40,
    backgroundColor: colors.alertRed,
  },
  progressBar: {
    width: dimensions.width * 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
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
    paddingRight: 10,
  },
  name: {
    fontFamily: 'Roboto',
    fontSize: 18.5,
    fontWeight: '200',
    color: colors.richBlack,
    padding: 5,
    paddingLeft: 0,
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

const menu = StyleSheet.create({
  toggleWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'green',
    padding: 10,
    paddingTop: 7,
  },
});

export default ConfirmPaymentCard;
