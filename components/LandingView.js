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
        <Button style={{fontFamily: "Roboto"}} onPress={Actions.LandingScreenView}>UX Test V1.0</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.CreatePaymentViewContainer}>Create Payment</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.CreateAccountViewContainer}>Create Account</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.ArrowNavDouble}>Arrow Nav Double</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.TrackingContainer}>TrackingContainer</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.LandingScreenContainer}>Landing Page</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.BankOnboardingContainer}>Bank Onboarding</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.SignInViewContainer}>Sign In</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.MainViewContainer}>Main</Button>
      </View>
    );
  }
}

module.exports = LandingView;
