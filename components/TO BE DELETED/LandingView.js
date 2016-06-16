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
  },

  textStyling: {
    fontFamily: "Roboto"
  }
});

class LandingView extends React.Component {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
        <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>Launch page</Text>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}}>Continue With Facebook</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.OnBoarding_Email}>Create Account with Email</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}}>Sign In</Button>
      </View>
    );
  }
}

module.exports = LandingView;
