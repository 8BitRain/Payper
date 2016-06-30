import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import typography from "./styles/typography";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292B2E",
  },

  textStyling: {
    fontFamily: "Roboto",
    fontSize: 32,
    color: "#F4F4F9",
    fontWeight: "normal",
    textAlign: "center"
  }
});

class ThankYouView extends React.Component {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
        <Text style={[styles.textStyling, typography.marginTop, typography.marginBottom, typography.marginSides]}>Thanks for taking part in this test. Have a great day!</Text>
      </View>
    );
  }
}

module.exports = ThankYouView;
