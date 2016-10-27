// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableHighlight, Platform } from 'react-native';
import Button from 'react-native-button';
import Entypo from 'react-native-vector-icons/Entypo'

// Helpers
import * as Timestamp from '../../helpers/Timestamp';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Stylesheets
import styles from '../../styles/Previews/Transaction';
import colors from '../../styles/colors';
var dimensions = Dimensions.get('window');

class PendingConfirmation extends React.Component {
  constructor(props) {
    super(props);
  }

  _getUserPic(pic, name) {
    if (!pic || pic == "") {
      name = name.split(" ");
      var initials = (name.length > 1) ? name[0].substring(0, 1) + name[name.length - 1].substring(0, 1) : name[0].substring(0, 1);
      return(
        <View style={[styles.pic, styles.initials]}>
          <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.accent}}>{ initials }</Text>
        </View>
      );
    };

    return <Image style={styles.pic} source={{uri: pic}} />;
  };

  _getPendingConfirmationAlert() {
    return(
      <Text style={[styles.confirmText, { backgroundColor: colors.alertRed, borderRadius: 4, overflow: 'hidden' }]}>
        Pending Confirmation
      </Text>
    );
  };

  _getButtons() {
    return(
      <View style={styles.confirmationWrap}>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={colors.alertGreen}
          onPress={() => this.props.confirmPayment()}
          style={[styles.confirmationButton, {backgroundColor: colors.alertGreen}]}>

          <Text style={styles.confirmText}>Accept</Text>

        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={colors.alertRed}
          onPress={() => this.props.rejectPayment()}
          style={[styles.confirmationButton, {backgroundColor: colors.alertRed}]}>

          <Text style={styles.confirmText}>Reject</Text>

        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return(
      <View style={styles.wrap}>
        <View style={styles.top}>
          { /* Profile picture */ }
          <View style={styles.picWrap}>
            { this._getUserPic(this.props.user.pic, this.props.user.name) }
          </View>

          { /* Name and payment info */ }
          <View style={styles.textWrap}>
            <Text style={styles.name}>{ this.props.user.name }</Text>
            <Text style={styles.text}>${ this.props.payment.amount } per {(this.props.payment.frequency === "WEEKLY") ? "week" : "month"} - { this.props.payment.purpose }</Text>
            <Text style={styles.text}>Next payment: TBD</Text>
          </View>

          { /* Payment settings button */ }
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor={'transparent'}
            onPress={() => this.props.showMenu()}
            style={styles.dots}>
            <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={20} color={colors.accent}/>
          </TouchableHighlight>
        </View>

        <View style={styles.bottom}>
          { (this.props.showButtons) ? this._getButtons() : this._getPendingConfirmationAlert() }
        </View>
      </View>
    );
  }
};

export default PendingConfirmation;
