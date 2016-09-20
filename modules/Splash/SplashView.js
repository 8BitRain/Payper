// Dependencies
import React from 'react';
import { View, Text, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
var FBLoginManager = require('NativeModules').FBLoginManager;

// Helpers
import * as Init from '../../_init';
import * as Async from '../../helpers/Async';

// Custom styles
import colors from '../../styles/colors';

class SplashView extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSignInSuccess() {
    console.log("%cSigned in: true", "color:green;font-weight:900;");
    Actions.MainViewContainer();
  }

  _handleSignInFailure() {
    console.log("%cSigned in: false", "color:red;font-weight:900;");
    Actions.LandingScreenContainer();
  }

  // Try to sign in with session token. If none is present, take the user to
  // the landing screen.

  /**
    *   Check if user has already entered their beta credentials.
    *     => if yes, take them through typical app flow
    *     => if no, take them to the beta lander
  **/
  componentWillMount() {
    // Async.get('betaStatus', (val) => {
    //   if (val == "fullAccess") {
        // Extend scope
        const _this = this;

        Init.signInWithToken(function(signedIn) {

          // Session token was valid. Sign in succeeded
          if (signedIn && typeof signed == 'boolean') _this._handleSignInSuccess();

          // Session token has expired. Refresh the token and try again
          else if (signedIn = "sessionTokenExpired") {
            console.log("%cSession token has expired. Refreshing...", "color:orange;font-weight:900;");
            Init.signInWithRefreshedToken(function(signedIn) {
              if (signedIn) _this._handleSignInSuccess();
              else _this._handleSignInFailure();
            });
          }

          // No session token was found. User must sign in manually
          else _this._handleSignInFailure();

        });
    //   } else {
    //     Actions.BetaLandingScreenView();
    //   }
    // });
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
