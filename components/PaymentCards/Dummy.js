// Dependencies
import React from 'react';
import { View, Text, Image, Dimensions, TouchableHighlight } from 'react-native';
import Entypo from "react-native-vector-icons/Entypo"

// Helpers
import * as Timestamp from "../../helpers/Timestamp";

// Stylesheets
import styles from '../../styles/Previews/Transaction';
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

/**
  *   Return a profile picture with the given source image
**/
function getUserPic(pic, name) {
  // If no profile picture, create and return initials thumbnail
  if (pic == "") {
    name = name.split(" ");
    var initials;
    (name.length > 1)
    ? initials = name[0].substring(0, 1) + name[name.length - 1].substring(0, 1)
    : initials = name[0].substring(0, 1);
    return(
      <View style={[styles.pic, styles.initials]}>
        <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.accent}}>{ initials }</Text>
      </View>
    );
  };

  // If profile picture is present, return it in circular form
  return <Image style={styles.pic} source={{uri: pic}} />;
};


/**
  *   Return a ready-to-render confirm button
**/
function getConfirmButton(callback) {
  return(
    <TouchableHighlight
      onPress={() => callback()}
      style={[styles.confirmationButton, {backgroundColor: colors.alertGreen}]}>
      <Text style={styles.confirmText}>Accept</Text>
    </TouchableHighlight>
  );
};


/**
  *   Return a ready-to-render reject button
**/
function getRejectButton(callback) {
  return(
    <TouchableHighlight
      onPress={() => callback()}
      style={[styles.confirmationButton, {backgroundColor: colors.alertRed}]}>
      <Text style={styles.confirmText}>Reject</Text>
    </TouchableHighlight>
  );
};


/**
  *   Return full confirmation button wrap View
**/
function getConfirmButtons(callbackConfirm, callbackReject) {
  return(
    <View style={styles.bottom}>
      <View style={styles.confirmationWrap}>
        { getConfirmButton(callbackConfirm) }
        { getRejectButton(callbackReject) }
      </View>
    </View>
  );
};


/**
  *   Return a ready-to-render progress bar
**/
function getProgressBar(payment) {
  return(
    <View style={styles.bottom}>
      <View style={styles.barWrap}>
        <View style={[styles.bar, {flex: payment.paymentsMade / payment.payments}]}></View>
        <View style={{flex: 1 - payment.paymentsMade / payment.payments}}></View>
        <Text style={styles.progressText}>{ payment.paymentsMade } of { payment.payments }</Text>
      </View>
    </View>
  );
};


/**
  *   Return a 'Pending confirmation' alert to render in place of the progress bar
**/
function getPendingConfirmationAlert() {
  return(
    <View style={styles.bottom}>
      <View style={styles.alert}>
        <Text style={styles.confirmText}>Pending Confirmation</Text>
      </View>
    </View>
  );
};


/**
  *   Return a 'Pending invitation' alert to render in place of the progress bar
**/
function getPendingInvitationAlert(options) {
  return(
    <View style={styles.bottom}>
      <View style={[styles.alert, { width: dimensions.width * 0.9, padding: 10, backgroundColor: colors.accent }]}>
        <Text style={styles.confirmText}>
          { (options.incoming)
              ? "We invited " + options.name + " to join Payper. Payments will commence after they set up their account and confirm your request."
              : "We invited " + options.name + " to join Payper. Payments will commence after they set up their account." }
        </Text>
      </View>
    </View>
  );
};


/**
  *   Return a 'Waiting for user to add funding source' alert to render in place
  *   of the progress bar
**/
function getAwaitingFundingSourceAlert(options) {
  console.log("getAwaitingFundingSourceAlert.options:", options);
  return(
    <View style={styles.bottom}>
      <View style={[styles.alert, { width: dimensions.width * 0.9, padding: 10, backgroundColor: colors.alertRed }]}>

        { (options.incoming)
            ? <Text style={styles.confirmText}>
                { (options.updatingFundingSource)
                    ? "We're updating your bank information. Payments will commence in the next few minutes."
                    : "It looks like you haven't linked a bank account to your Payper account. Payments will commence once you do so." }
              </Text>
            : <Text style={styles.confirmText}>
                { (options.updatingFundingSource)
                    ? "We're updating " + options.name + ( (options.name.charAt(options.name.length - 1) == 's') ? "'" : "'s" ) + " bank information. Payments will commence in the next few minutes."
                    : "It looks like " + options.name + " hasn't linked a bank account to their Payper account yet. Payments will commence once they do so." }
              </Text> }

      </View>
    </View>
  );
};

export default class Dummy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={[styles.wrap, { borderBottomWidth: 0 }]}>
        { /* Top chunk (pic, name, payment info) */ }
        <View style={styles.top}>

          { /* Profile picture */ }
          <View style={styles.picWrap}>
            { (this.props.out)
                ? getUserPic(this.props.payment.recip_pic, this.props.payment.recip_name)
                : getUserPic(this.props.payment.sender_pic, this.props.payment.sender_name) }
          </View>

          { /* Name and payment info */ }
          <View style={styles.textWrap}>
            <Text style={styles.name}>{ (this.props.out) ? this.props.payment.recip_name : this.props.payment.sender_name }</Text>
            <Text style={[styles.text, { color: colors.white }]}>${ this.props.payment.amount } per month - { this.props.payment.purpose }</Text>
            <Text style={[styles.text, { color: colors.white }]}>Next payment: { (typeof this.props.payment.nextPayment === 'number') ? Timestamp.calendarize(this.props.payment.nextPayment) : "Unbeknownst to thee!" }</Text>
          </View>

          { /* Payment settings button */ }
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor={'transparent'}
            onPress={() => this.props.callbackMenu()}
            style={styles.dots}>
            <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={20} color={colors.accent}/>
          </TouchableHighlight>
        </View>

        { /* Bottom chunk (progress bar or awaiting funding source alert) */ }
        { (this.props.payment.nextPayment == "waiting_on_fs")
            ? (this.props.currentUser.uid == this.props.payment.recip_id)
              ? getAwaitingFundingSourceAlert({name: this.props.payment.recip_name.split(" ")[0], incoming: true, updatingFundingSource: this.props.currentUser.appFlags.updating_funding_source})
              : getAwaitingFundingSourceAlert({name: this.props.payment.recip_name.split(" ")[0], incoming: false, updatingFundingSource: this.props.currentUser.appFlags.updating_funding_source})
            : <View style={[styles.bottom]}>
                <View style={styles.barWrap}>
                  <View style={[styles.bar, {flex: this.props.payment.paymentsMade / this.props.payment.payments}]}></View>
                  <View style={{flex: 1 - this.props.payment.paymentsMade / this.props.payment.payments}}></View>
                  <Text style={[styles.progressText, { color: colors.white }]}>{ this.props.payment.paymentsMade } of { this.props.payment.payments }</Text>
                </View>
              </View> }

      </View>
    );
  }
};
