import React from 'react'
import {View, Text, StyleSheet} from "react-native"
import Button from "react-native-button"
import {Actions} from "react-native-router-flux"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: 'red',
  }
})

class InviteOnlyLander extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{"Invite Only Lander"}</Text>
        <Button onPress={Actions.Lander}>{"Get Access"}</Button>
        <Button onPress={() => Actions.error("You don't have access.")}>{"Don't Get Access"}</Button>
      </View>
    )
  }
}

module.exports = InviteOnlyLander
