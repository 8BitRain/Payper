import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: 'red',
  }
});

class LandingView extends React.Component {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
        <Text>Launch page</Text>
        <Button>Continue With Facebook</Button>
        <Button onPress={Actions.OnBoarding_Email}>Create Account with Email</Button>
        <Button>Sign In</Button>
      </View>
    );
  }
}

module.exports = LandingView;
