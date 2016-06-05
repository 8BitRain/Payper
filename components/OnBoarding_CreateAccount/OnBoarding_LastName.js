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

class OnBoarding_LastName extends React.Component {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>And what&#39;s your last name? </Text>
      <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, fontFamily:"Roboto", fontWeight:"100"}} defaultValue={"West"}/>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.OnBoarding_PhoneNumber}>Next</Button>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.pop}>back</Button>
      </View>
    );
  }
}

module.exports = OnBoarding_LastName;
