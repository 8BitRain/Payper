import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import {colors} from '../../../globalStyles'

export default class ContinueButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this.props.onPress()}>

        <View style={{ height: 60, backgroundColor: colors.accent, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '400', color: colors.snowWhite, alignSelf: 'center', textAlign: 'center' }}>
            { this.props.text }
          </Text>
        </View>

      </TouchableHighlight>
    );
  }
}
