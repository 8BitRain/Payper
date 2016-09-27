// Dependencies
import React from 'react';
import { View, Text, Image, NetInfo, TouchableHighlight, Animated, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';
var FBLoginManager = require('NativeModules').FBLoginManager;

// Helpers
import * as Init from '../../_init';
import * as Async from '../../helpers/Async';

// Custom styles
import colors from '../../styles/colors';

class SplashView extends React.Component {
  constructor(props) {
    super(props);

    this.refreshIconInterpolator = new Animated.Value(0);

    this.state = {
      connected: true,
      reconnecting: false,
      refreshIconAngle: this.refreshIconInterpolator.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg'],
      }),
    };
  }

  _rotateRefreshIcon() {
    Animated.timing(this.refreshIconInterpolator, {
      toValue: 100,
      duration: 900,
      easing: Easing.elastic(1),
    }).start(() => {
      this.refreshIconInterpolator.setValue(0);
    });
  }

  _handleSignInSuccess() {
    console.log("%cSigned in: true", "color:green;font-weight:900;");
    Actions.MainViewContainer();
  }

  _handleSignInFailure() {
    console.log("%cSigned in: false", "color:red;font-weight:900;");
    Actions.LandingScreenContainer();
  }

  _attemptReconnect() {
    if (this.state.reconnecting) return;

    this.setState({
      reconnecting: true,
      reconnectMessage: "Attempting connection...",
    });

    this._rotateRefreshIcon();
    var interval = setInterval(() => this._rotateRefreshIcon(), 900);

    NetInfo.isConnected.fetch().then(isConnected => {
      clearInterval(interval);
      if (isConnected) this._onConnect();
      else this._onDisconnect();
    });
  }

  _onConnect() {
    this.setState({ connected: true });

    // Extend scope
    const _this = this;

    // Check beta status
    Async.get('betaStatus', (val) => {
      if (val == "fullAccess") {
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
      } else {
        Actions.BetaLandingScreenView();
      }
    });
  }

  _onDisconnect() {
    this.setState({ connected: false });
  }

  componentWillMount() {
    NetInfo.isConnected.fetch().then((connected) => {
      if (connected) this._onConnect();
      else this._onDisconnect();
    });
  }

  render() {
    return(
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent}}>
        { (this.state.connected)
            ? <Text style={{fontFamily: 'Roboto', fontSize: 40, fontWeight: '300', color: colors.white}}>
                { "Payper" }
              </Text>
            : <View>
                <Text style={{fontFamily: 'Roboto', fontSize: 24, fontWeight: '300', color: colors.white, padding: 15, textAlign: 'center'}}>
                  { (this.state.reconnecting)
                      ? "Reconnecting..."
                      : "Error establishing\nconnection 🙄" }
                </Text>

                <TouchableHighlight
                  underlayColor={colors.accent}
                  activeOpacity={0.8}
                  onPress={() => this._attemptReconnect()}>

                  <View>
                    <Animated.View style={{ transform: [{ rotate: this.state.refreshIconAngle }] }}>
                      <Entypo style={{ alignSelf: 'center' }} name={"cycle"} size={32} color={colors.white} />
                    </Animated.View>

                    { (this.state.reconnecting)
                        ? null
                        : <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '300', color: colors.white, padding: 8, textAlign: 'center' }}>
                            { "Tap to retry" }
                          </Text> }
                  </View>
                </TouchableHighlight>
              </View> }
      </View>
    );
  }
};

export default SplashView;
