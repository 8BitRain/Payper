// Dependencies
import React from 'react';
import { View, Text, Animated, Image, Dimensions, Linking, StatusBar, StyleSheet, TouchableHighlight, Modal, TextInput, Keyboard } from 'react-native';
import { Actions } from 'react-native-router-flux';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Hyperlink from 'react-native-hyperlink'
import { colors } from '../../globalStyles'
//Vibrancy view is currently not implemented in Android https://github.com/react-native-community/react-native-blur#android
import { VibrancyView } from 'react-native-blur'
import { deviceOS } from '../../helpers'
var DeviceInfo = require('react-native-device-info');

// Helpers
import * as Validators from '../../helpers/validators';
import * as Lambda from '../../services/Lambda';
import * as Async from '../../helpers/Async';

// Should we show container borders?
const borders = false;

// Window dims
const dims = Dimensions.get('window');

class BetaLandingScreenView extends React.Component {
  constructor(props) {
    super(props);

    this.logoAspectRatio = 377 / 568;
    this.keyboardOffset = new Animated.Value(0);

    this.state = {
      modalVisible: false,
      headerHeight: 0,
      onboarding: "",
      phoneInput: "",
      phoneValid: false,
      buttonText: ""
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
      attempts: 0
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
          setTimeout(() => alert("We'll send you an invite via text when a spot opens up!"), 750);
        });
      } else if (this.state.onboarding == "invite-verification") {
        console.log("Verifying that", phoneInput, "received an invite");
        Lambda.checkBetaInvites({ phoneNumber: phoneInput }, (res) => {
          if (res.match) this._onVerificationSuccess();
          else this._onVerificationFailure();
        });
      }
     }

     // If invalid, display error
     else {
      this.setState({ buttonText: "Please enter a valid phone number." });
    }
  }

  _handleChangeText(input) {
    this.setState({ phoneInput: input });

    // Determine if the input is valid
    let valid = Validators.validatePhone(input).valid;

    // tovalue: 350 background color of 'Continue' button
    if (valid) {
      this.setState({ buttonText: "Continue" });
    } else {
      this.setState({ buttonText: "Please enter a valid phone number" });
    }
  }

  _renderVibrancyView(){
    if(DeviceInfo.getSystemName() == "Android"){
      return (null);
    } else if (DeviceInfo.getSystemName() == "iPhone OS"){
      return(<VibrancyView blurType={"light"} style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />);
    }
  }

  _getPhoneOnboarding() {
    return(
      <View style={[wrappers.modalWrap]}>
        {/*<VibrancyView blurType={"light"} style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />*/}
        {this._renderVibrancyView()}

        { /* Header */ }
        <View style={wrappers.modalHeader}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => { this.setState({ onboarding: "" }); this._toggleModal(); }}>

            <EvilIcons style={icons.closeModal} name={"close"} size={24} color={colors.deepBlue} />

          </TouchableHighlight>
        </View>

        { /* Rest of modal */ }
        <View style={wrappers.modalContent}>
          <Text style={{fontSize: 22, color: colors.deepBlue, width: dims.width - 80, textAlign: 'center'}}>
            { "What's your phone number?" }
          </Text>

          {(this.state.onboarding === "invite-request")
            ? <Text style={{fontSize: 18, color: colors.deepBlue, textAlign: 'center', padding: 20, width: dims.width - 80, textAlign: 'center'}}>
                { "We'll send you an invite when a spot opens up!" }
              </Text>
            : null }

          <TextInput
            style={wrappers.modalInputPhone}
            placeholderFontFamily={"Roboto"}
            placeholderTextColor={colors.slateGrey}
            placeholder={"e.g. 2623058038"}
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

              <Animated.View style={{ height: 70, backgroundColor: colors.gradientGreen, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite}}>
        <StatusBar barStyle="default" />

        <View style={{flex: 0.9, justifyContent: 'center', alignItems: 'center'}}>
          { /* Logo */ }
          <Image source={require('../../assets/images/logo.png')} style={{height: dims.width * 0.22, width: (dims.width * 0.22) * this.logoAspectRatio}} />

          { /* Welcome message */ }
          <Text style={{fontWeight: '500', fontSize: 26, color: colors.accent, textAlign: 'center', width: dims.width - 80, marginTop: 20}}>
            {"Welcome to Payper,"}
          </Text>
          <Text style={{fontSize: 18, color: colors.accent, textAlign: 'center', width: dims.width - 80}}>
            {"the app that makes recurring payments easy."}
          </Text>

          { /*
          <Text style={{fontSize: 16, color: colors.deepBlue, width: dims.width - 100, marginTop: 20, textAlign: 'center'}}>
            {"Payper is invite-only. Request an invite from us, or ask a friend who already has access to invite you."}
          </Text>
          */ }

          { /* "I received an invite" button */ }
          <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={() => {
            this.setState({ onboarding: "invite-request", buttonText: "Please enter a valid phone number." });
            this._toggleModal();
          }}>
            <View style={{width: dims.width - 60, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gradientGreen, borderRadius: 4, marginTop: 20}}>
              <Text style={{fontSize: 16, color: colors.snowWhite}}>
                {"Request an invite"}
              </Text>
            </View>
          </TouchableHighlight>

          { /* "Request an invite" button */ }
          <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={() => {
            this.setState({ onboarding: "invite-verification", buttonText: "Please enter a valid phone number." });
            this._toggleModal();
          }}>
            <View style={{width: dims.width - 60, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 4, marginTop: 6}}>
              <Text style={{fontSize: 16, color: colors.snowWhite}}>
                {"I received an invite"}
              </Text>
            </View>
          </TouchableHighlight>
        </View>

        { /* Footer */ }
        <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'flex-end', padding: 15}}>
          <Hyperlink
            onPress={(url) => this.handleURLClick(url)}
            linkStyle={{color:'#2980b9', fontSize:14}}
            linkText={(url) => {
              if (url === 'https://www.getpayper.io/terms')
                return 'Terms of Service';
              else if (url === 'https://www.getpayper.io/privacy')
                return 'Privacy Policy';
            }}>
            <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: colors.deepBlue, fontWeight: '100' }}>
              { "By creating an account or logging in, you agree to Payper's https://www.getpayper.io/terms and https://www.getpayper.io/privacy." }
            </Text>
          </Hyperlink>
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
    backgroundColor: colors.snowWhite,
    paddingTop: 25,
  },
  button: {
    width: dims.width,
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
    backgroundColor: DeviceInfo.getSystemName() == "Android" ?  colors.snowWhite : colors.snowWhiteOpaque,
    width: dims.width,
  },
  modalHeader: {
    flex: 0.125,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'blue',
    paddingTop: 10,
    width: dims.width,
  },
  modalContent: {
    flex: 0.875,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'red',
    width: dims.width,
  },
  modalInputPhone: {
    width: dims.width * 0.6,
    marginLeft: dims.width * 0.2,
    marginRight: DeviceInfo.getSystemName() == "Android" ? dims.width * .2 : 0,
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 50,
    textAlign: 'center',
    color: colors.deepBlue,
  },
  modalInputEmail: {
    width: dims.width * 0.7,
    marginLeft: dims.width * 0.15,
    marginTop: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    height: 50,
    textAlign: 'center',
    color: colors.deepBlue,
  },
});

const typography = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.accent,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: colors.deepBlue,
    textAlign: 'center',
  },
  button: {
    fontSize: 18,
    color: colors.snowWhite,
    alignSelf: 'flex-start',
  },
  modalTitle: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '200',
    color: colors.snowWhite,
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
