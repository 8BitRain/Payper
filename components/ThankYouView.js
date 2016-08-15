import React from 'react';
import {View, Text, StyleSheet, Image} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import typography from "./styles/typography";
import colors from "../styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.richBlack,
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
        <Text style={[styles.textStyling, typography.marginTop, typography.marginBottom, typography.marginSides]}>Thanks for taking part in this test. Enjoy this Cheetah and Puppy!</Text>
        <Image source={require("./assets/Tiger&Cheetah.png")}/>
      </View>
    );
  }
}

module.exports = ThankYouView;
