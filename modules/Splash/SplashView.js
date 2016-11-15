// Dependencies
import React from 'react';
import { View, Text, Image, NetInfo, TouchableHighlight, Animated, Easing, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Mixpanel from 'react-native-mixpanel';
import Entypo from 'react-native-vector-icons/Entypo';
var FBLoginManager = require('NativeModules').FBLoginManager;

// Helpers
import * as Init from '../../_init';
import * as Async from '../../helpers/Async';

// Custom styles
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

class SplashView extends React.Component {
  constructor(props) {
    super(props);

    this.refreshIconInterpolator = new Animated.Value(0);

    this.state = {
      connected: true,
      reconnecting: false,
      refreshIconAngle: this.refreshIconInterpolator.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg']
      })
    };
  }

  componentWillMount() {
    const _this = this;
    Mixpanel.timeEvent('Load Time: Splash View');

    this.ConnectivityListener = NetInfo.isConnected.addEventListener('change', (isConnected) => {
      if (_this.state.reconnecting && !_this.state.connected)
        clearInterval(_this.rotationInterval);

      if (isConnected)
        _this._onConnect();
      else
        _this._onDisconnect();
    });
  }

  componentWillUnmount() {
    Mixpanel.track('Load Time: Splash View');
    this.ConnectivityListener.remove();
  }

  _rotateRefreshIcon() {
    Animated.timing(this.refreshIconInterpolator, {
      toValue: 100,
      duration: 900,
      easing: Easing.elastic(1)
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
    Actions.LandingScreenViewContainer();
    FBLoginManager.logOut();
  }

  _attemptReconnect() {
    if (this.state.reconnecting) return;
    this.setState({ reconnecting: true, reconnectMessage: "Attempting connection..." });
    this._rotateRefreshIcon();
    this.rotateInterval = setInterval(() => this._rotateRefreshIcon(), 900);
  }

  _onConnect() {
    const _this = this;
    this.setState({ connected: true });

    // Check beta status
    Async.get('betaStatus', (val) => {
      if (val == "fullAccess") {
        Async.get('user', (user) => {
          if (!user) {
            this._handleSignInFailure();
          } else {
            user = JSON.parse(user);
            this.props.currentUser.initialize(user);
            // _this._handleSignInSuccess();
            // let onboardingState = (user.appFlags) ? user.appFlags.onboarding_state : null;
            // if (onboardingState === "customer" || !user.loginToken) {
            //   _this._handleSignInFailure();
            // } else {
            //   this.props.currentUser.loginWithCachedToken({ loginToken: user.loginToken, firebaseToken: user.token },
            //     () => _this._handleSignInSuccess(),
            //     () => _this._handleSignInFailure());
            // }
          }
        });
      } else {
        Actions.BetaLandingScreenView();
      }
    });
  }

  _onDisconnect() {
    Mixpanel.track('Connection Failed');
    this.setState({ connected: false });
  }

  render() {
    return(
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack}}>
        { (this.state.connected)
            ? <Image source={require('../../assets/images/logo.png')} style={{ width: dimensions.width * (117/635), height: (dimensions.width * (117/635) * (568/377)) }} />
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
