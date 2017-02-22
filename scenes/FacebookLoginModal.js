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

class FacebookLoginModal extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={Actions.Main}>{"Complete Facebook Login"}</Button>
        <Button onPress={Actions.pop}>{"Cancel Facebook Login"}</Button>
      </View>
    )
  }
}

module.exports = FacebookLoginModal
