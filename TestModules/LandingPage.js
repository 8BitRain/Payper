import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class LandingPage extends Component {
  render() {
    // Navigate to Main scene
    const goToMain = () => {
      console.log("START: goToMain(vash)");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=");
      Actions.Main({from: this.props.title});
    }

    return (
      <View style={{margin: 128}}>
        <Text onPress={goToMain}>Go to Main</Text>
      </View>
    )
  }
}
