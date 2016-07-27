// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Dimensions, AsyncStorage} from "react-native";
import Button from "react-native-button";
import {Reducer, Router, Actions} from 'react-native-router-flux';
import * as Animations from "../../helpers/animations";
import * as Firebase from "../../services/Firebase";
import * as Init from "../../_init";

// Stylesheets
import colors from "../../styles/colors";
import styles from '../../styles/SignIn/Generic';

// Custom components
import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";
import Loading from "../../components/Loading/Loading";

var dimensions = Dimensions.get('window');

class SignInView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false,
      doneLoading: false,
    }

    this.arrowNavProps = {
      left: false,
      right: true,
    }
  }


  signInWithEmail() {
    var _this = this;
    this.setState({loading: true});
    Init.signInWithEmail({email: this.state.email, password: this.state.password}, function(signedIn) {
      _this.setState({doneLoading: true});
    });
  }


  render() {
    if (this.state.loading) {
      return(
        <Loading
          complete={this.state.doneLoading}
          msgSuccess={"Welcome!"}
          msgError={"Sign in failed"}
          msgLoading={"One sec..."}
          destination={() => Actions.MainViewContainer()} />
      );
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.white}}>

          <View style={{backgroundColor: colors.icyBlue, paddingBottom: 10, flex: 0.12, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Roboto', fontSize: 40, fontWeight: '300', color: colors.white, textAlign: 'center'}}>Payper</Text>
          </View>

          <View style={{flex: 0.7, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.label}>
              Sign In
            </Text>

            <TextInput
              style={styles.input}
              placeholder={"Email"}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={"email-address"}
              onChangeText={(text) => this.setState({email: text}) }
              onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.refs.password.focus() }} />

            <TextInput
              ref="password"
              style={styles.input}
              placeholder={"Password"}
              secureTextEntry
              onChangeText={(text) => this.setState({password: text}) }
              onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.signInWithEmail() }} />

            { /* Arrow nav buttons */ }
            <View>
              <ArrowNav
                dark
                arrowNavProps={this.arrowNavProps}
                callbackRight={() => { this.signInWithEmail() }} />
            </View>
          </View>

          { /* Filler */ }
          <View style={{flex:0.18}} />
        </View>
<<<<<<< HEAD



        <View style={{flex: 0.4, flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.darkGrey}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 30, fontWeight: '300', textAlign: 'center', color: colors.white}}>
            Sign In
          </Text>
          <TextInput
            style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15, marginTop: 10}]}
            placeholder={"Email"}
            autoFocus={true}
            autocapitalize={false}
            keyboardType={"email-address"}
            onChangeText={(text) => this.setState({email: text}) } />
          <TextInput
            style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15, marginTop: 10}]}
            placeholder={"Password"}
            autoFocus={true}
            secureTextEntry
            onChangeText={(text) => this.setState({password: text}) } />
        </View>

        { /* Filler */ }
        <View style={{flex:0.4, backgroundColor: colors.darkGrey}}></View>
        { /* Arrow nav buttons */ }
        <View style={{position: 'absolute', bottom: 220, left: 0, right: 0}}>
          <ArrowNav
          arrowNavProps={this.arrowNavProps}
          callbackRight={() => { this.signInWithEmail() }} />
        </View>


        <LoginButton
        readPermissions={["email","public_profile", "user_friends"]}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert("login has error: " + result.error);
            } else if (result.isCancelled) {
              alert("login is cancelled.");
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  console.log("Grabbing Facebook AccesToken for User: " +
                   "\n" + "======+++++==========++++++======="
                   + "\n" + JSON.stringify(data));
                  this.state.fbAcessToken = data.accessToken;
                  this.fbAPIRequest();
                }
              )
            }
          }
        }
        onLogoutFinished={() => alert("logout.")}/>
      </View>
    );

=======
      );
    }
>>>>>>> app-flow
  }
}


export default SignInView;
