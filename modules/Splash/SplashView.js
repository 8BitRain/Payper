// Dependencies
import React from 'react';
import { View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
var FBLoginManager = require('NativeModules').FBLoginManager;


// Helper functions
import * as Init from '../../_init';

// Custom styles
import colors from '../../styles/colors';

class SplashView extends React.Component {
  constructor(props) {
    super(props);
  }

  // Try to sign in with session token. If none is present, take the user to
  // the landing screen.
  componentWillMount() {
    Init.signInWithToken(function(signedIn) {
      if (signedIn) {
        console.log("%cSigned in: " + signedIn, "color:green;font-weight:900;");
        Actions.MainViewContainer();
      } else {
        console.log("%cSigned in: " + signedIn, "color:red;font-weight:900;");

        // Log out of Facebook auth if logged in
        FBLoginManager.logout(function(err, data) {
          if (err) console.log(err, data);
          else console.log("%cLogged out of Facebook", "color:green;font-weight:900;");
        });

        Actions.LandingScreenContainer();
      }
    });
  }

  render() {
    return(
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent}}>
        <Text style={{fontFamily: 'Roboto', fontSize: 40, fontWeight: '300', color: colors.white}}>
          Payper
        </Text>
      </View>
    );
  }
};

export default SplashView;
