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

class Active extends React.Component {
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
            <Text style={styles.text}>${ this.props.payment.amount } per month - { this.props.payment.payments }</Text>
            <Text style={styles.text}>Next payment: { Timestamp.calendarize(this.props.payment.nextPayment) }</Text>
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

        { /* Progress Bar */ }
        <View style={[styles.bottom]}>
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

export default Active;
