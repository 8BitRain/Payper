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

class PendingFundingSource extends React.Component {
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

  _getPendingFundingSourceMessage() {
    return(
      <View style={[styles.bottom, { paddingBottom: 7 }]}>
        <Text style={[styles.confirmText, { backgroundColor: colors.alertRed, width: dimensions.width * 0.8, borderRadius: 4, overflow: 'hidden' }]}>
          { this.props.message }
        </Text>
      </View>
    );
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

        { this._getPendingFundingSourceMessage() }
      </View>
    );
  }
};

export default PendingFundingSource;
