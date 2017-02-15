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

class Lander extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{"Welcome to Payper"}</Text>
        <Button onPress={Actions.FacebookLogin}>{"Login with Facebook"}</Button>
      </View>
    )
  }
}

module.exports = Lander
