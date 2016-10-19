// Dependencies
import React from 'react';
import { View, Text, Animated, Image, Dimensions, Linking, StatusBar, StyleSheet, TouchableHighlight, Modal, TextInput, Keyboard } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo'
import colors from '../../styles/colors';

// Helpers
import * as Validators from '../../helpers/validators';
import * as Lambda from '../../services/Lambda';
import * as Async from '../../helpers/Async';

// Should we show container borders?
const borders = false;

// Window dimensions
const dimensions = Dimensions.get('window');

class BetaLandingScreenView extends React.Component {
  constructor(props) {
    super(props);

    this.logoAspectRatio = 377 / 568;
    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);

    this.state = {
      modalVisible: false,
      headerHeight: 0,
      onboarding: "",
      phoneInput: "",
      phoneValid: false,
      buttonText: "",
      backgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350, 700], // Green, transparent, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
    };
  }

  componentDidMount() {
    // Subscribe to keyboard events
    _keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
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
    this.setState({
      modalVisible: !this.state.modalVisible,
      phoneInput: "",
      emailInput: "",
      attempts: 0,
      backgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350, 700], // Green, transparent, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
    });

    // Reset button color
    this._interpolateButtonColor({
      toValue: 350,
    });
  }

  _onVerificationSuccess() {
    // Display a brief welcome message
    this.setState({ buttonText: "Welcome!" });

    // After a brief welcome message, take the user to the typical lander
    setTimeout(() => {
      this._toggleModal();
      Actions.LandingScreenViewContainer();
    }, 600);

    // Prevent the user from seeing this screen next time they load the app
    Async.set('betaStatus', 'fullAccess', () => {
      Async.get('betaStatus', (val) => {
        console.log("Beta status:", val);
      });
    });
  }

  _onVerificationFailure() {
    this.setState({ buttonText: "No match 😕\nIs there a typo?" });
    this._interpolateButtonColor({ toValue: 700 });
  }

  _handleSubmit(e) {
    if (e) e.preventDefault();
    const { phoneInput } = this.state;

    // Determine if the input is valid
    let valid = Validators.validatePhone(phoneInput).valid;

    // If valid, send POST request
    if (valid) {
      this.setState({ buttonText: "Verifying your number..." });
      if (this.state.onboarding == "invite-request") {
        Lambda.requestBetaInvite({ phone: phoneInput }, (res) => {
          this._toggleModal();
          setTimeout(() => alert("We'll send you an invite via text when a spot opens up!"), 500);
        });
      } else if (this.state.onboarding == "invite-verification") {
        console.log("Verifying that", phoneInput, "received an invite");
        Lambda.checkBetaInvites({ phoneNumber: phoneInput }, (res) => {
          if (res.match) this._onVerificationSuccess();
          else this._onVerificationFailure();
        });
      }
     }

     // If invalid, interpolate 'Continue' button color to red and display error
     else {
      this._interpolateButtonColor({ toValue: 700 });
      this.setState({ buttonText: "Please enter a valid phone number." });
    }
  }

  _handleChangeText(input) {

    this.setState({ phoneInput: input });

    // Determine if the input is valid
    let valid = Validators.validatePhone(input).valid;

    // Interpolate background color of 'Continue' button
    if (valid) {
      this._interpolateButtonColor({ toValue: 0 });
      this.setState({ buttonText: "Continue" });
    } else {
      this._interpolateButtonColor({ toValue: 350 });
      this.setState({ buttonText: "Please enter a valid phone number" });
    }
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

          {(this.state.onboarding === "invite-request")
            ? <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: colors.white, textAlign: 'center', padding: 20, fontWeight: '200' }}>
                { "We'll send you an invite when a spot opens up!" }
              </Text>
            : null }

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
            onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(e); }} />

          { /* Arrow nav buttons */ }
          <Animated.View style={{position: 'absolute', bottom: this.keyboardOffset, left: 0, right: 0}}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this._handleSubmit()}>

              <Animated.View style={{ height: 70, backgroundColor: this.state.backgroundColor, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[typography.button, { alignSelf: 'center', textAlign: 'center' }]}>
                  { this.state.buttonText }
                </Text>
              </Animated.View>

            </TouchableHighlight>
          </Animated.View>

        </View>
      </View>
    );
  }

  render() {
    return(
      <View style={wrappers.page}>

        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.4, width: (this.state.headerHeight * 0.4) * this.logoAspectRatio }} />
        </View>

        { /* Title */ }
        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[typography.title, { color: colors.white }]}>Welcome to</Text>
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
            onPress={() => { this.setState({ onboarding: "invite-verification", buttonText: "Please enter a valid phone number." }); this._toggleModal(); }}>

            <View style={[wrappers.button, { backgroundColor: 'rgba(255, 255, 255, 0.1)', }]}>
              { /* Text */ }
              <View style={{ flex: 0.9, paddingLeft: 15 }}>
                <Text style={typography.button}>
                  { "I received an invite" }
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
            onPress={() => { this.setState({ onboarding: "invite-request", buttonText: "Please enter a valid phone number." }); this._toggleModal(); }}>

            <View style={[wrappers.button, { backgroundColor: 'rgba(255, 255, 255, 0.06)', }]}>
              { /* Text */ }
              <View style={{ flex: 0.9, paddingLeft: 15 }}>
                <Text style={typography.button}>
                  { "Request an invite" }
                </Text>
              </View>

              { /* Chevron */ }
              <View style={{ flex: 0.1, paddingRight: 22.5 }}>
                <Entypo style={icons.chevron} name={"chevron-thin-right"} size={22} color={colors.accent} />
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

          { this._getPhoneOnboarding() }

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
    flex: 0.125,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'blue',
    paddingTop: 10,
    width: dimensions.width,
  },
  modalContent: {
    flex: 0.875,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'red',
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
    fontSize: 36,
    fontWeight: '200',
    color: colors.accent,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 24,
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
    fontSize: 24,
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
