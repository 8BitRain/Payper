/**
  *   Sign in cases:
  *   --------------
  *     1. Success!
  *         -> take user to the app
  *     2. Failure, no account with that email was found
  *         -> display error message, close modal
  *     3. Failure, incorrect password
  *         -> display error message, close modal
  *     4. Failure, time out
  *         -> display error message with "Try Again" and "Cancel" options
**/

// Dependencies
import React from 'react';
import { View, Text } from 'react-native';
import Login from '../../services/Login';

class SignInView extends React.Component {
  constructor(props) {
    super(props);

    var firebaseConfig = {
      apiKey: "AIzaSyAwRj_BiJNEvKJC7GQSm9rv9dF_mjIhuzM",
      authDomain: "coincast.firebaseapp.com",
      databaseURL: "https://coincast.firebaseio.com",
      storageBucket: "firebase-coincast.appspot.com"
    };

    var loginParams = {
      email: "brady.sherid@gmail.com",
      password: "1997June2!"
    };

    console.log("Constructing Login...");
    var Login = new Login(firebaseConfig);

    console.log("Initializing Login...");
    Login.initialize();

    console.log("Logging in with email...");
    // Login.withEmail(loginParms);
  }

  render() {
    return(
      <View style={{ flex: 1.0, backgroundColor: colors.richBlack }}>
        <Text style={{ color: colors.white, fontSize: 16 }}>
          Testing Login.js
        </Text>
      </View>
    );
  }
}
export default SignInView;
