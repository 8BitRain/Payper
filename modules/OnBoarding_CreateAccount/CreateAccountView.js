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

const OnBoarding_Email = React.createClass({
  render(){
    return (
      <View {...this.props}  style={styles.container}>
        <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>Hey, what&#39;s your email? </Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, color: "white"}} placeholderFontFamily="Roboto"  placeholder={"example@gmail.com"}/>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.OnBoarding_Password}>Next</Button>
        <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.pop}>back</Button>
      </View>
    );
  }
} );

const OnBoarding_FirstName = React.createClass( {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>And what&#39;s your first name? </Text>
      <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, fontFamily:"Roboto", fontWeight:"100"}} defaultValue={"Kanye"}/>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.OnBoarding_LastName}>Next</Button>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.pop}>back</Button>
      </View>
    );
  }
}
);

const OnBoarding_LastName = React.createClass( {
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
} );

const  OnBoarding_Password = React.createClass( {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>And what&#39;s your password </Text>
      <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, fontFamily:"Roboto", fontWeight:"100"}} defaultValue={""}/>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.OnBoarding_FirstName}>Next</Button>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.pop}>back</Button>
      </View>
    );
  }
} );

const OnBoarding_PhoneNumber = React.createClass( {
  render(){
    return (
      <View {...this.props}  style={styles.container}>
      <Text style={{fontFamily: "Roboto", fontWeight:"100"}}>And what&#39;s your phone number? </Text>
      <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, fontFamily:"Roboto", fontWeight:"100"}} placeholder={"123-241-5678"}/>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.OnBoarding_Summary}>Next</Button>
      <Button style={{fontFamily: "Roboto", fontWeight:"100"}} onPress={Actions.pop}>back</Button>
      </View>
    );
  }
} );

const  OnBoarding_Summary = React.createClass( {
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
} );


const  CreateAccountView = React.createClass({
  render(){
  console.log("Props: " + this.props.currentPage);
  console.log("Spitting");
  return(
    //console.log(this.props.currentPage);
    <OnBoarding_Email/>
  );
}
});

export default OnBoarding_Email;
export default CreateAccountView;
