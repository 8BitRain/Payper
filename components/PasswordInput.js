import React from 'react';
import {View, Text, StyleSheet, TextInput, Image} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import * as Validators from "../helpers/validators";

const typo = StyleSheet.create({
  // General typography styles
  general: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "normal",
    color: "#fff"
  },

  eye: {
    height: 36,
    width: 36,
    left: 50
  },

  // Varying font sizes (ex. "What's your email?")
  fontSizeTitle: { fontSize: 25 },
  fontSizeNote: { fontSize: 20 },
  fontSizeError: { fontSize: 15},

  textInput: {
    height: 40,
    backgroundColor: "transparent",
    padding: 10,
    paddingLeft: 0,
    color: "#fff",
        fontFamily: "Roboto",
        fontWeight: "normal"
  },

  visibleInput: {
    opacity: 1
  },

  invisibleInput: {
    opacity: 0
  },


  // Helper styles
  marginLeft: { marginLeft: 20 },
  marginBottom: { marginBottom: 20 },
  marginTop: { marginBottom: 20 },
  marginRight: { marginBottom: 20 },
  marginSides: {
    marginLeft: 20,
    marginRight: 20
  },
  padLeft: { paddingLeft: 20 },
  padBottom: { paddingBottom: 20 },
  padTop: { paddingBottom: 20 },
  padRight: { paddingBottom: 20 }
});

class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.passwordInput = this.props.password;
    this.hidePassword = true;
}

  render(){
    return (
      <View {...this.props}  >
        { this.hidePassword ?
        <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom, typo.visibleInput, typo.general]} defaultValue={this.passwordInput} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput)}} onChangeText={(text) => {this.passwordInput = text; this.props.dispatchSetPasswordValidations(this.passwordInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none"  secureTextEntry={true} placeholder={"not \"password\" :)"} />   :
        <TextInput style={[typo.textInput, typo.marginSides, typo.marginBottom, typo.visibleInput, typo.general]} defaultValue={this.passwordInput} onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.props.dispatchSetPage(2, "forward", this.props.passwordValidations, this.passwordInput)}} onChangeText={(text) => {this.passwordInput = text; this.props.dispatchSetPasswordValidations(this.passwordInput)}} autoCorrect={false} autoFocus={true} autoCapitalize="none"  secureTextEntry={false} placeholder={"not \"password\" :)"} />}
        <Button onPress={() =>{
          if(this.hidePassword){
            this.hidePassword =  false;
            console.log(this.props.passwordToggle);
            this.props.dispatchPasswordToggle(this.hidePassword);
            console.log("Switched to false");
          }
          else {
            this.hidePassword = true;
            this.props.dispatchPasswordToggle(this.hidePassword);
            console.log("Switched to true");
          }
        }
        }>
          <Image style={typo.eye} source={require('../assets/open.png')} />
        </Button>
      </View>
    );
  }
}

export default PasswordInput;
