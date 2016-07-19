// Dependencies
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

// Stylesheets
import colors from '../styles/colors';

var dimensions = Dimensions.get('window');

var styles = StyleSheet.create({
  button: {
    backgroundColor: colors.facebookBlue,
    width: dimensions.width - 50,
    height: 50,
    paddingTop: 14.5,
    borderRadius: 4,
    color: colors.white,
    marginTop: 10,
  },
});


class FacebookSignIn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View>
        <LoginButton
          onPress={() => console.log("TEST")}
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
}


export default FacebookSignIn;
