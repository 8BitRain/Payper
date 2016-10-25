// Dependencies
import React from 'react';
import { View, Text, Image, Dimensions, TouchableHighlight } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Timestamp from '../../helpers/Timestamp';

// Stylesheets
import styles from '../../styles/Previews/Transaction';
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

export default class Dummy extends React.Component {
  constructor(props) {
    super(props);
  }

  getUserPic(pic, name) {
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

    return <Image style={styles.pic} source={{uri: pic}} />;
  }

  render() {
    return(
      <View style={[styles.wrap, { backgroundColor: colors.white, borderTopWidth: 0, borderBottomWidth: 0, borderColor: colors.accent }]}>
        { /* Top chunk (pic, name, payment info) */ }
        <View style={styles.top}>

          { /* Profile picture */ }
          <View style={styles.picWrap}>
            { (this.props.out)
                ? this.getUserPic(this.props.payment.recip_pic, this.props.payment.recip_name)
                : this.getUserPic(this.props.payment.sender_pic, this.props.payment.sender_name) }
          </View>

          { /* Name and payment info */ }
          <View style={styles.textWrap}>
            <Text style={styles.name}>{ (this.props.out) ? this.props.payment.recip_name : this.props.payment.sender_name }</Text>
            <Text style={styles.text}>${ this.props.payment.amount } per month - { this.props.payment.purpose }</Text>
            <Text style={styles.text}>Next payment: { (typeof this.props.payment.nextPayment === 'number') ? Timestamp.calendarize(this.props.payment.nextPayment) : "Unbeknownst to thee!" }</Text>
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

        { /* Bottom chunk (progress bar or awaiting funding source alert) */
          (this.props.payment.nextPayment == "waiting_on_fs")
            ? (this.props.currentUser.uid == this.props.payment.recip_id)
              ? getAwaitingFundingSourceAlert({name: this.props.payment.recip_name.split(" ")[0], incoming: true, updatingFundingSource: this.props.currentUser.appFlags.updating_funding_source})
              : getAwaitingFundingSourceAlert({name: this.props.payment.recip_name.split(" ")[0], incoming: false, updatingFundingSource: this.props.currentUser.appFlags.updating_funding_source})
            : <View style={[styles.bottom]}>
                <View style={styles.barWrap}>
                  <View style={[styles.bar, {flex: this.props.payment.paymentsMade / this.props.payment.payments}]}></View>
                  <View style={{flex: 1 - this.props.payment.paymentsMade / this.props.payment.payments}}></View>
                  <Text style={styles.progressText}>{ this.props.payment.paymentsMade } of { this.props.payment.payments }</Text>
                </View>
              </View> }
      </View>
    );
  }
};
