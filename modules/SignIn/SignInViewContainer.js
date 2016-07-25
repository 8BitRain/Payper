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
    var _this = this;  //Is this line necessary?
    this.setState({loading: true});
    Init.signInWithEmail({email: this.state.email, password: this.state.password}, function(signedIn) {
      _this.setState({doneLoading: true});
    });
  }

  //Sign in for facebook
  signInWithCredential(){
    this.setState({loading: true});
    
  }


  render() {
    if (this.state.loading) {
      return(
        <Loading
          complete={this.state.doneLoading}
          msgSuccess={"Welcome!"}
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
      );
    }
  }
}


export default SignInView;
