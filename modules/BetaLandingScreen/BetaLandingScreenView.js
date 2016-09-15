// Dependencies
import React from 'react';
import { View, Text, Animated, Image, Dimensions, Linking, StatusBar, StyleSheet, TouchableHighlight, Modal, TextInput, DeviceEventEmitter } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Hyperlink from 'react-native-hyperlink';
import Entypo from 'react-native-vector-icons/Entypo'
import colors from '../../styles/colors';
var Mixpanel = require('react-native-mixpanel');

// Helpers
import * as Validators from '../../helpers/validators';
import * as Lambda from '../../services/Lambda';

// Should we show container borders?
const borders = false;

// Window dimensions
const dimensions = Dimensions.get('window');

class BetaLandingScreenView extends React.Component {
  constructor(props) {
    super(props);

    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);

    this.state = {
      modalVisible: false,
      onboarding: "",
      phoneInput: "",
      emailInput: "",
      valid: false,
      attempts: 0,
      buttonText: "",
      touchable: true,
      backgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350, 700], // Green, transparent, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
    };
  }

  componentDidMount() {
    // Subscribe to keyboard events
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));

    // Initialize button color
    this._interpolateButtonColor({
      toValue: 350,
    });
  }

  componentWillUnmount() {
    // Unsubscribe from keyboard events
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }

  _interpolateButtonColor(options) {
    Animated.spring(this.colorInterpolator, {
      toValue: options.toValue
    }).start();
  }

  _keyboardWillShow(e) {
    Animated.spring(this.keyboardOffset, {
      toValue: e.endCoordinates.height,
      friction: 6
    }).start();
  }

  _keyboardWillHide(e) {
    Animated.spring(this.keyboardOffset, {
      toValue: 0,
      friction: 6
    }).start();
  }

  _toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  _onVerificationSuccess() {
    console.log("Welcome!");
  }

  _handleSubmit() {

    const { phoneInput, emailInput } = this.state;

    // Determine if the input is valid
    var valid = (this.state.onboarding == "phone")
      ? Validators.validatePhone(phoneInput).valid
      : Validators.validateEmail(emailInput).valid;

    // If valid, submit. If not, interpolate 'Continue' button color to red
    if (valid) {
      this.setState({ buttonText: "Verifying..." });
      console.log("Submitting:", emailInput);
      if (this.state.onboarding == "email") {
        Lambda.checkBetaSignups({ email: this.state.emailInput }, (res) => {
          if (res.match) {
            this.setState({ buttonText: "Welcome!" });
            setTimeout(() => {
              this._onVerificationSuccess();
            }, 600);
          } else {
            this.setState({ buttonText: "No match :(\nIs there a typo?" });
            this._interpolateButtonColor({ toValue: 700 });
          }
        });
      } else if (this.state.onboarding == "phone") {
        Lambda.checkBetaInvites({ phoneNumber: this.state.phoneInput }, (res) => {

        });
      }
     } else {
      this._interpolateButtonColor({ toValue: 700 });
      this.setState({ buttonText: (this.state.onboarding == "email") ? "Please enter a valid email address." : "Please enter a valid phone number." });
    }
  }

  _handleChangeText(input) {

    if (this.state.onboarding == "phone") this.setState({ phoneInput: input });
    else if (this.state.onboarding == "email") this.setState({ emailInput: input });

    // Determine if the input is valid
    var valid = (this.state.onboarding == "phone")
      ? Validators.validatePhone(input).valid
      : Validators.validateEmail(input).valid;

    this.setState({ valid: valid });

    // Interpolate background color of 'Continue' button
    if (valid) {
      this._interpolateButtonColor({ toValue: 0 });
      this.setState({ buttonText: "Continue" });
    } else {
      this._interpolateButtonColor({ toValue: 350 });
      if (this.state.buttonText.split("")[0] != "Please") {
        this.setState({ buttonText: "Please enter a valid " + ((this.state.onboarding == "phone") ? "phone number" : "email address") });
      }
    }

  }

  _getSubmitButtonText(valid) {
    if (valid) return "Continue";
    else {
      if (this.state.onboarding == "email") {
        return "Please enter a valid email address."
      } else if (this.state.onboarding == "phone") {
        return "Please enter a valid phone number."
      }
    }
  }

  _getEmailOnboarding() {
    return(
      <View style={wrappers.modalWrap}>

        { /* Header */ }
        <View style={wrappers.modalHeader}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => { this.setState({ onboarding: "" }); this._toggleModal(); }}>

            <Entypo style={icons.closeModal} name={"cross"} size={24} color={colors.white} />

          </TouchableHighlight>
        </View>

        { /* Rest of modal */ }
        <View style={wrappers.modalContent}>
          <Text style={typography.modalTitle}>
            { "What's your email?" }
          </Text>

          <TextInput
            ref={"emailInput"}
            style={wrappers.modalInputEmail}
            placeholderFontFamily={"Roboto"}
            placeholderTextColor={colors.lightGrey}
            placeholder={""}
            defaultValue={this.state.emailInput}
            autoCorrect={false} autoFocus autoCapitalize={"none"}
            onChangeText={(input) => this._handleChangeText(input)}
            onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }} />

          { /* Arrow nav buttons */ }
          <Animated.View style={{position: 'absolute', bottom: this.keyboardOffset, left: 0, right: 0}}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => { (this.state.touchable) ? this._handleSubmit() : console.log("Submit button not currently touchable") }}>

              <Animated.View style={{ height: 55, backgroundColor: this.state.backgroundColor, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[typography.button, { alignSelf: 'center' }]}>
                  { this.state.buttonText }
                </Text>
              </Animated.View>

            </TouchableHighlight>
          </Animated.View>

        </View>
      </View>
    );
  }

  _getPhoneOnboarding() {
    return(
      <View style={wrappers.modalWrap}>

        { /* Header */ }
        <View style={wrappers.modalHeader}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => { this.setState({ onboarding: "" }); this._toggleModal(); }}>

            <Entypo style={icons.closeModal} name={"cross"} size={24} color={colors.white} />

          </TouchableHighlight>
        </View>

        { /* Rest of modal */ }
        <View style={wrappers.modalContent}>
          <Text style={typography.modalTitle}>
            { "What's your number?" }
          </Text>

          <TextInput
            style={wrappers.modalInputPhone}
            placeholderFontFamily={"Roboto"}
            placeholderTextColor={colors.lightGrey}
            placeholder={""}
            defaultValue={this.state.phoneInput}
            autoCorrect={false} autoFocus
            keyboardType={"phone-pad"}
            maxLength={10}
            onChangeText={(input) => this._handleChangeText(input)}
            onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }} />

        </View>
      </View>
    );
  }

  render() {
    return(
      <View style={wrappers.page}>

        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Title */ }
        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={typography.subtitle}>Welcome to</Text>
          <Text style={typography.title}>Payper</Text>
        </View>

        { /* Subtitle */ }
        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', padding: 15 }}>
          <Text style={typography.subtitle}>
            { "The app that makes recurring peer-to-peer payments simple." }
          </Text>
        </View>

        { /* Invite button */ }
        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => { this.setState({ onboarding: "phone" }); this._toggleModal(); }}>

            <View style={[wrappers.button, { backgroundColor: 'rgba(255, 255, 255, 0.1)', }]}>
              { /* Text */ }
              <View style={{ flex: 0.9, paddingLeft: 15 }}>
                <Text style={typography.button}>
                  { "I was invited by a friend" }
                </Text>
              </View>

              { /* Chevron */ }
              <View style={{ flex: 0.1, paddingRight: 22.5 }}>
                <Entypo style={icons.chevron} name={"user"} size={20} color={colors.accent} />
              </View>
            </View>
          </TouchableHighlight>

          { /* Beta list button */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => { this.setState({ onboarding: "email" }); this._toggleModal(); }}>

            <View style={[wrappers.button, { backgroundColor: 'rgba(255, 255, 255, 0.06)', }]}>
              { /* Text */ }
              <View style={{ flex: 0.9, paddingLeft: 15 }}>
                <Text style={typography.button}>
                  { "I requested an invite on getpayper.io" }
                </Text>
              </View>

              { /* Chevron */ }
              <View style={{ flex: 0.1, paddingRight: 22.5 }}>
                <Entypo style={icons.chevron} name={"mouse"} size={20} color={colors.accent} />
              </View>
            </View>
          </TouchableHighlight>
        </View>

        { /* Modal containing edit panel */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={ () => alert("Closed modal") }>

          { (this.state.onboarding == "email")
              ? this._getEmailOnboarding()
              : this._getPhoneOnboarding() }

        </Modal>
      </View>
    );
  }
};

const wrappers = StyleSheet.create({
  page: {
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.richBlack,
    paddingTop: 25,
  },
  button: {
    width: dimensions.width,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    flex: 0.5,
  },
  modalWrap: {
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    width: dimensions.width,
  },
  modalHeader: {
    flex: 0.1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'blue',
    paddingTop: 10,
    width: dimensions.width,
  },
  modalContent: {
    flex: 0.9,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'red',
    paddingTop: 40,
    width: dimensions.width,
  },
  modalInputPhone: {
    width: dimensions.width * 0.6,
    marginLeft: dimensions.width * 0.2,
    marginTop: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    height: 50,
    textAlign: 'center',
    color: colors.white,
  },
  modalInputEmail: {
    width: dimensions.width * 0.7,
    marginLeft: dimensions.width * 0.15,
    marginTop: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    height: 50,
    textAlign: 'center',
    color: colors.white,
  },
});

const typography = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
    fontSize: 34,
    fontWeight: '200',
    color: colors.accent,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: '200',
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '200',
    color: colors.white,
    alignSelf: 'flex-start',
  },
  modalTitle: {
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: '200',
    color: colors.white,
    textAlign: 'center',
  },
});

const icons = StyleSheet.create({
  chevron: {
    alignSelf: 'flex-end',
  },
  closeModal: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
});

export default BetaLandingScreenView;
