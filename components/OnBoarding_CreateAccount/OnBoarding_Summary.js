import React from 'react';
import {View, Text, TextInput, StyleSheet} from "react-native";
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

class OnBoarding_Summary extends React.Component {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>Username </Text>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>Password</Text>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>First Name</Text>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>Last Name </Text>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>Phone Number</Text>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.pop}>back</Button>
      </View>
    );
  }
}

module.exports = OnBoarding_Summary;
