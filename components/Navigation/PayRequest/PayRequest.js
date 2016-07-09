// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableHighlight} from "react-native";
import Button from "react-native-button";

import colors from '../../../styles/colors';

class PayRequest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={{flexDirection: 'row', height: 60, borderTopColor: colors.darkGrey, borderTopWidth: 1}}>
        <TouchableHighlight onPress={() => this.props.requestCallback()} style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.offWhite, borderRightColor: colors.darkGrey, borderRightWidth: 0.5}}>
          <View>
            <Text style={{fontSize: 20, fontWeight: '700', color: colors.icyBlue}}>REQUEST</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => this.props.payCallback()} style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.offWhite, borderLeftColor: colors.darkGrey, borderLeftWidth: 0.5}}>
          <View>
            <Text style={{fontSize: 20, fontWeight: '700', color: colors.icyBlue}}>PAY</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
};

export default PayRequest;
