import React from 'react';
import {View, Text, TextInput, StyleSheet, timeout} from "react-native";
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

class OnBoarding_FirstName extends React.Component {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
      <Text>And what&#39;s your first name? </Text>
      <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}} defaultValue={"Kanye"}/>
      <Button onPress={Actions.OnBoarding_LastName}>Next</Button>
      <Button onPress={Actions.pop}>back</Button>
      </View>
    );
  }
}

module.exports = OnBoarding_FirstName;
