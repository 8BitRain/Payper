// Dependencies
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';
import Entypo from "react-native-vector-icons/Entypo"

// Helper functions
import * as Timestamp from "../../../helpers/Timestamp";
import * as StringMaster5000 from "../../../helpers/StringMaster5000";

// Custom styles
import styles from '../../../styles/Previews/Transaction';
import colors from '../../../styles/colors';
var dimensions = Dimensions.get('window');


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
        <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.icyBlue}}>{ initials }</Text>
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
      <View style={[styles.alert, { width: dimensions.width * 0.9, padding: 10 }]}>
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
  *   Returns a user preview for each the user specified in 'user' prop
**/
class PaymentPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    /**
      *   Payment invites
    **/
    if (this.props.payment.invite) {
      return(
        <View style={styles.wrap}>
          { /* Top chunk (pic, name, payment info) */ }
          <View style={styles.top}>

            { /* Profile picture */ }
            <View style={styles.picWrap}>
              { (this.props.payment.invitee == "recip")
                  ? getUserPic("", this.props.payment.recip_name)
                  : getUserPic("", this.props.payment.sender_name) }
            </View>

            { /* Name and payment info */ }
            <View style={styles.textWrap}>
              <Text style={styles.name}>{ (this.props.out) ? this.props.payment.recip_name : this.props.payment.sender_name }</Text>
              <Text style={styles.text}>${ this.props.payment.amount } per month for {this.props.payment.payments} months { StringMaster5000.formatPurpose(this.props.payment.purpose) }</Text>
            </View>

            { /* Payment settings button */ }
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor={'transparent'}
              onPress={() => console.log("TRANSACTION DOTS PRESSED")}
              style={styles.dots}>
              <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={20} color={colors.icyBlue}/>
            </TouchableHighlight>

            { /* Cancel payment button */ }
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor={'transparent'}
              onPress={() => this.props.callbackCancel(this.props.payment.pid)}
              style={[styles.dots, styles.cancel]}>
              <Entypo style={styles.iconSettings} name="block" size={17.5} color={colors.alertRed}/>
            </TouchableHighlight>
          </View>

          { /* Get bottom half contents */ }
          { (this.props.payment.invitee == "recip")
              ? getPendingInvitationAlert({incoming: false, name: this.props.payment.recip_name.split(" ")[0]})
              : getPendingInvitationAlert({incoming: true, name: this.props.payment.sender_name.split(" ")[0]}) }

        </View>
      );
    }

    /**
      *   Confirmed payements
      *   (handle incoming vs. outgoing conditionals inline)
    **/
    else if (this.props.payment.confirmed) {
      return(
        <View style={styles.wrap}>
          { /* Top chunk (pic, name, payment info) */ }
          <View style={styles.top}>

            { /* Profile picture */ }
            <View style={styles.picWrap}>
              {
                (this.props.out)
                ? getUserPic(this.props.payment.recip_pic, this.props.payment.recip_name)
                : getUserPic(this.props.payment.sender_pic, this.props.payment.sender_name)
              }
            </View>

            { /* Name and payment info */ }
            <View style={styles.textWrap}>
              <Text style={styles.name}>{ (this.props.out) ? this.props.payment.recip_name : this.props.payment.sender_name }</Text>
              <Text style={styles.text}>${ this.props.payment.amount } per month - { this.props.payment.purpose }</Text>
              <Text style={styles.text}>Next payment: { (this.props.payment.nextPayment) ? Timestamp.calendarize(this.props.payment.nextPayment) : "Unbeknownst to thee!" }</Text>
            </View>

            { /* Payment settings button */ }
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor={'transparent'}
              onPress={() => console.log("TRANSACTION DOTS PRESSED")}
              style={styles.dots}>
              <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={20} color={colors.icyBlue}/>
            </TouchableHighlight>

            { /* Cancel payment button */ }
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor={'transparent'}
              onPress={() => this.props.callbackCancel(this.props.payment.pid)}
              style={[styles.dots, styles.cancel]}>
              <Entypo style={styles.iconSettings} name="block" size={17.5} color={colors.alertRed}/>
            </TouchableHighlight>
          </View>

          { /* Bottom chunk (progress bar) */ }
          <View style={styles.bottom}>
            <View style={styles.barWrap}>
              <View style={[styles.bar, {flex: this.props.payment.paymentsMade / this.props.payment.payments}]}></View>
              <View style={{flex: 1 - this.props.payment.paymentsMade / this.props.payment.payments}}></View>
              <Text style={styles.progressText}>{ this.props.payment.paymentsMade } of { this.props.payment.payments }</Text>
            </View>
          </View>
        </View>
      );
    }

    /**
      *   Unconfirmed payements
      *   (handle incoming vs. outgoing conditionals inline)
    **/
    else {
      return(
        <View style={styles.wrap}>
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
              <Text style={styles.name}>
                { (this.props.out)
                  ? this.props.payment.recip_name
                  : this.props.payment.sender_name }
              </Text>
              <Text style={styles.text}>
                { (this.props.out)
                  ? ("Requesting $" + this.props.payment.amount + " per month for " + this.props.payment.payments + " months")
                  : ("$" + this.props.payment.amount + " per month - " + this.props.payment.purpose) }
              </Text>
              <Text style={styles.text}>
                { (this.props.out)
                  ? "for " + this.props.payment.purpose
                  : "Payments will begin 24 hours after confirmation." }
              </Text>
            </View>

            { /* Payment settings button */ }
            <TouchableHighlight
              activeOpacity={0.7}
              underlayColor={'transparent'}
              onPress={() => console.log("TRANSACTION DOTS PRESSED")}
              style={styles.dots}>
              <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={20} color={colors.icyBlue}/>
            </TouchableHighlight>
          </View>

          { /* Get bottom half contents */ }
          { (this.props.out) ? getConfirmButtons(this.props.callbackConfirm, this.props.callbackReject) : getPendingConfirmationAlert() }

        </View>
      );
    }
  }
};

export default PaymentPreview;
