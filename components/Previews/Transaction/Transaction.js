// Dependencies
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';
import Entypo from "react-native-vector-icons/Entypo"

// Custom styles
import styles from '../../../styles/Previews/Transaction';
import colors from '../../../styles/colors';
var dimensions = Dimensions.get('window');

// Return a profile picture with the given source image
function getUserPic(pic) {
  return(
    <Image style={styles.pic} source={{uri: pic}} />
  );
};

/**
  *   Returns a user preview for each the user specified in 'user' prop
**/
class TransactionPreview extends React.Component {
  constructor(props) {
    super(props);

    // This is mock data rn
    this.state = {
      flow: 'in',
      user: {
        first_name: 'Vash',
        last_name: 'Marada',
        username: '@Vash-Marada',
        pic: 'http://cdn.theatlantic.com/assets/media/img/photo/2015/11/images-from-the-2016-sony-world-pho/s01_130921474920553591/main_900.jpg?1448476701',
      },
      totalCost: '120',
      eachCost: '10',
      totalPayments: '12',
      completedPayments: '4',
      memo: 'Toilet paper',
      next: 'August 2nd at 2:47am',
    }
  }

  render() {
    return(
      <View style={styles.wrap}>
        <View style={styles.top}>
          <View style={styles.picWrap}>
            { getUserPic(this.state.user.pic) }
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.name}>{ this.state.user.first_name + " " + this.state.user.last_name }</Text>
            <Text style={styles.text}>${ this.state.eachCost } per month - { this.state.memo }</Text>
            <Text style={styles.text}>Next payment: { this.state.next }</Text>
          </View>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => console.log("TRANSACTION DOTS PRESSED")} style={styles.dots}>
            <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={30} color={colors.icyBlue}/>
          </TouchableHighlight>
        </View>
        <View style={styles.bottom}>
          <View style={styles.barWrap}>
            <View style={[styles.bar, {flex: this.state.completedPayments / this.state.totalPayments}]}></View>
            <View style={{flex: 1 - this.state.completedPayments / this.state.totalPayments}}></View>
            <Text style={styles.progressText}>{ this.state.completedPayments } of { this.state.totalPayments } payments made</Text>
          </View>
        </View>
      </View>
    );
  }
};

export default TransactionPreview;
