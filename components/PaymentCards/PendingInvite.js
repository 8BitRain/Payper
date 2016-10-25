// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableHighlight, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'

// Helpers
import * as Timestamp from '../../helpers/Timestamp';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Stylesheets
import styles from '../../styles/Previews/Transaction';
import colors from '../../styles/colors';
var dimensions = Dimensions.get('window');

class PendingInvite extends React.Component {
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
            <Text style={styles.text}>${ this.props.payment.amount } per month - { this.props.payment.purpose }</Text>
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

        { /* Pending invite message */ }
        <View style={[styles.bottom, { paddingBottom: 7 }]}>
          <Text style={[styles.confirmText, { backgroundColor: colors.alertGreen, width: dimensions.width * 0.8, borderRadius: 4, overflow: 'hidden' }]}>
            { "We invited " + this.props.user.name.split(" ")[0] + " to join Payper. Payments will commence when they create an account." }
          </Text>
        </View>
      </View>
    );
  }
};

export default PendingInvite;
