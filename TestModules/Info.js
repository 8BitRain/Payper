import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Info extends Component {
  render() {
    // Vash's info
    const vash = {
      name: "Vash",
      phone: "123456789"
    }

    // Passes Vash's info to parent Scene
    const editInfo = () => {
      console.log("START: editInfo(vash)");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=");
      Actions.editInfo(vash);
    }

    return (
      <View style={{margin: 128}}>
        <Text>Name: {this.props.name}</Text>
        <Text>Phone: {this.props.phone}</Text>
        <Text onPress={editInfo}>Vashify</Text>
      </View>
    )
  }
}
