// Dependencies
import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Easing, Image, Dimensions, AsyncStorage, TouchableHighlight, DeviceEventEmitter } from 'react-native';
import Button from 'react-native-button';
import { Reducer, Router, Actions } from 'react-native-router-flux';
import * as Animations from '../../helpers/animations';
import * as Firebase from '../../services/Firebase';
import * as Init from '../../_init';

// Stylesheets
import colors from '../../styles/colors';
import styles from '../../styles/SignIn/Generic';
import typography from './styles/typography';
import Header from '../../components/Header/Header';
const dimensions = Dimensions.get('window');

// Custom components
import ArrowNav from '../../components/Navigation/Arrows/ArrowDouble';
import Loading from '../../components/Loading/Loading';

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

class SignInView extends React.Component {
  constructor(props) {
    super(props);

    this.inputOffsetBottom = new Animated.Value(0);
    this.MAX_ATTEMPTS = 7;

    this.headerProps = {
      types: {
        "paymentIcons": false,
        "circleIcons": false,
        "settingsIcon": false,
        "closeIcon": true,
        "backIcon": false,
        "appLogo": true
      },
      obsidian: true,
      index: 0,
      numCircles: 0
    };

    this.state = {
      email: "",
      password: "",
      loading: false,
      doneLoading: false,
      signInSuccess: false,
      attempts: [],
      attemptLimitReached: false,
      remainingAttempts: this.MAX_ATTEMPTS,
      resetEmailSentTo: false,
    }

    this.arrowNavProps = {
      left: true,
      right: true,
    }

    this.input = {
      email: "",
      password: "",
    }
  }

  componentDidMount() {
    // Subscribe to keyboard events
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  componentWillUnmount() {
    // Unsubscribe from keyboard events
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
    console.log("Sign in view is unmounting...");
  }

  _keyboardWillShow(e) {
    this.refs.inputWrap.measureInWindow((x, y, width, height) => {
      var diff = e.endCoordinates.height - y;
      if (diff > 0 && this.inputOffsetBottom._value < diff) {
        Animated.timing(this.inputOffsetBottom, {
          toValue: diff / 2,
          duration: 200,
          easing: Easing.elastic(1),
        }).start();
      }
    });
  }

  _keyboardWillHide(e) {
    Animated.timing(this.inputOffsetBottom, {
      toValue: 0,
      duration: 200,
      easing: Easing.elastic(1),
    }).start();
  }

  signInWithEmail() {
    const _this = this;

    // If a reminder email has been sent the user is now trying to sign in with
    // a different email, get rid of any rendered reminder email messages
    if (this.input.email != this.state.email) {
      this.setState({
        resetEmailSentTo: false,
        attemptLimitReached: false,
      });
    }

    // Save email and password to state
    // TODO: Validate here
    this.setState({ email: this.input.email, password: this.input.password }, () => {

      // Increment sign-in attempt count for this email
      if (typeof this.state.attempts[this.state.email] != 'number') this.state.attempts[this.state.email] = 1;
      else this.state.attempts[this.state.email]++;

      // Update remainingAttempts count
      this.setState({ remainingAttempts: this.MAX_ATTEMPTS - this.state.attempts[this.state.email] });

      console.log("Sign in attempts:", this.state.attempts);
      console.log("Remaining attempts:", this.MAX_ATTEMPTS - this.state.attempts[this.state.email]);

      // If user is out of attempts, set attemptLimitReached to true
      if (this.MAX_ATTEMPTS - this.state.attempts[this.state.email] <= 0) {
        console.log("%cToo many sign in attempts.", "color:red;font-weight:900;");
        this.setState({ attemptLimitReached: true });
      }

      // Otherwise, sign the user in
      else {
        this.setState({ loading: true });
        Init.signInWithEmail({ email: this.state.email, password: this.state.password }, (success) => {
          this.setState({ doneLoading: true, signInSuccess: success });
        });
      }
    });
  }

  _resetPassword() {
    this.setState({ resetEmailSentTo: this.state.email });
    Firebase.sendPasswordResetEmail(this.state.email, function(success) {
      console.log("Password reset email sent:", success);
    });
  }

  _getAttemptLimitReachedMessage() {
    return(
      <View style={{width: dimensions.width * 0.85, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{padding: 10, textAlign: 'center'}}>
          { (this.state.resetEmailSentTo)
              ? "We sent password reset instructions to " + this.state.email
              : "For security reasons, we've limited the number of times you can attempt to sign in." }
        </Text>

        { /* Reset password button */ }
        <TouchableHighlight
          style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 4, backgroundColor: (this.state.resetEmailSentTo) ? colors.alertGreen : colors.icyBlue, paddingTop: 7.5, paddingBottom: 10, paddingLeft: 15, paddingRight: 15,}}
          onPress={() => this._resetPassword()}
          underlayColor={(this.state.resetEmailSentTo) ? colors.alertGreen : colors.icyBlue}
          activeOpacity={0.7}>

          <View>
            <Entypo style={{textAlign: 'center'}} name={(this.state.resetEmailSentTo) ? "check" : "mail"} size={20} color={colors.white} />
            <Text style={{fontSize: 14, fontWeight: '600', color: colors.white, textAlign: 'center'}}>
              { (this.state.resetEmailSentTo)
                  ? "Send another email"
                  : "Reset your password" }
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _getRemainingAttemptsMessage() {
    return(
      <View style={{ width: dimensions.width * 0.8, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{paddingTop: 10, textAlign: 'center'}}>
          { (this.state.remainingAttempts == 1)
              ? "You have " + this.state.remainingAttempts + " sign in attempt remaining."
              : "You have " + this.state.remainingAttempts + " sign in attempts remaining." }
        </Text>
      </View>
    );
  }

  render() {
    if (this.state.loading) {
      return(
        <Loading
          complete={this.state.doneLoading}
          success={this.state.signInSuccess}
          msgSuccess={"Welcome!"}
          msgError={"Sign in failed"}
          msgLoading={"Signing in"}
          successDestination={() => Actions.MainViewContainer()}
          errorDestination={() => { this.setState({ loading: false }) }} />
      );
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.obisdian}}>
          <Animated.View style={{ marginBottom: this.inputOffsetBottom }}>
            <View ref="inputWrap">

              { /*
              <Text style={[typography.general,  {marginBottom: 10}]}>
                Sign In
              </Text>
              */ }

              <TextInput
                style={typography.textInput}
                placeholder={"Email"}
                placeholderTextColor="#fefeff"
                defaultValue={this.state.email}
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={"email-address"}
                onChangeText={(text) => this.input.email = text}
                onKeyPress={(e) => {if (e.nativeEvent.key == "Enter") this.refs.password.focus() }} />

              <TextInput
                ref="password"
                style={typography.textInput}
                placeholder={"Password"}
                placeholderTextColor="#fefeff"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onChangeText={(text) => this.input.password = text} />

              { /* If sign in attempt limit has been reached, prompt user to reset password */
                (this.state.attemptLimitReached)
                  ? this._getAttemptLimitReachedMessage()
                  : (this.state.remainingAttempts <= 3)
                    ? this._getRemainingAttemptsMessage()
                    : null }

              { /* Continue button */ }
              <TouchableHighlight
                style={[buttonStyles.button, { backgroundColor: colors.accent, marginTop: 5 }]}
                activeOpacity={0.8}
                underlayColor={colors.accent}
                onPress={() => { this.signInWithEmail()}}>

                <Text style={{textAlign: 'center', fontFamily: 'Roboto', color: colors.white, fontSize: 18, fontWeight: '100', padding: 10}}>
                   Sign in
                </Text>
              </TouchableHighlight>
            </View>
          </Animated.View>

          { /* Sign up button */ }
          <TouchableHighlight
            ref="signUpButton"
            style={[buttonStyles.button, { marginTop: 30 }]}
            activeOpacity={0.8}
            underlayColor={colors.richBlack}
            onPress={() => Actions.CreateAccountViewContainer()}>

            <Text style={{textAlign: 'center', fontFamily: 'Roboto', color: colors.accent, fontSize: 17, fontWeight: '100', padding: 10}}>
              Don{"'"}t have an account?{"\n"}Sign up
            </Text>
          </TouchableHighlight>

          { /* Header */ }
          <Header transparent callbackClose={() => Actions.LandingScreenContainer()} headerProps={this.headerProps} />
        </View>
      );
    }
  }
}

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.richBlack,
    width: dimensions.width - 80,
    marginTop: 15,
    borderRadius: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    paddingTop: 4,
    paddingBottom: 4,
  },
});

export default SignInView;
