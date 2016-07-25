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
        <TouchableHighlight
          onPress={() => this.props.requestCallback()}
          style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white, borderRightColor: colors.darkGrey, borderRightWidth: 0.5}}
          underlayColor='transparent'
          activeOpacity={0.7}>
          <View>
            <Text style={{fontSize: 16, fontWeight: '600', color: colors.icyBlue}}>Request</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => this.props.payCallback()}
          style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white, borderLeftColor: colors.darkGrey, borderLeftWidth: 0.5}}
          underlayColor='transparent'
          activeOpacity={0.7}>
          <View>
            <Text style={{fontSize: 16, fontWeight: '600', color: colors.icyBlue}}>Pay</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
};

export default PayRequest;
