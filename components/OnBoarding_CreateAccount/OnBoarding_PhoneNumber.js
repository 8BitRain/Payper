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

class OnBoarding_PhoneNumber extends React.Component {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
      <Text>And what&#39;s your phone number? </Text>
      <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}} defaultValue={"123-241-5678"}/>
      <Button onPress={Actions.pop}>back</Button>
      </View>
    );
  }
}

module.exports = OnBoarding_PhoneNumber;
