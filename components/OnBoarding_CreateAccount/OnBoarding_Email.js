import React from 'react';
import {View, Text,TextInput, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E83151',
    borderWidth: 2,
    borderColor: 'red',
    color: 'white',
    /*#E83151 pinkish red */
    /*#61C9A8 turqouise-cyan*/
    /*#DB5461 Possible lighter on eyes Pink*/
    /*#67597A Plum*/

    //#DB5461

  },

  font_styling:{
    color: "white",
  }

});

class OnBoarding_Email extends React.Component {
  render(){
    console.log("Run the jewels-OnBoardinEmail");
    return (
      <View {...this.props}  style={styles.container}>
        <Text style={styles.font_styling}>Hey, what&#39;s your email? </Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, color: "white"}} defaultValue={"example@gmail.com"}/>
        <Button onPress={Actions.OnBoarding_Password}>Next</Button>
        <Button onPress={Actions.pop}>back</Button>
      </View>
    );
  }
}

module.exports = OnBoarding_Email;
