// Dependencies
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';
import Entypo from "react-native-vector-icons/Entypo"

// Helper functions
import * as Timestamp from "../../../helpers/Timestamp";

// Custom styles
import styles from '../../../styles/Previews/Transaction';
import colors from '../../../styles/colors';
var dimensions = Dimensions.get('window');

// Return a profile picture with the given source image
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
  *   Returns a user preview for each the user specified in 'user' prop
**/
class TransactionPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
            onPress={() => console.log("TRANSACTION DOTS PRESSED")} style={styles.dots}>
            <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={20} color={colors.icyBlue}/>
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
};

export default TransactionPreview;
