// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Animated, Easing, Dimensions, StatusBar, Image, Modal } from "react-native";
import { Actions } from 'react-native-router-flux';
import Mixpanel from 'react-native-mixpanel';
import Entypo from 'react-native-vector-icons/Entypo';
import dismissKeyboard from 'react-native-dismiss-keyboard';

// Pages
import Name from './pages/Name';
import Email from './pages/Email';
import Password from './pages/Password';
import Phone from './pages/Phone';
import Summary from './pages/Summary';
import BankOnboardingView from '../BankOnboarding/BankOnboardingView';

// Stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

export default class UserOnboardingView extends React.Component {
  constructor(props) {
    super(props);
    this.offsetX = new Animated.Value(0);
    this.logoAspectRatio = 377 / 568;
    this.errCodes = [];
    this.pages = ['name', 'email', 'password', 'phone', 'summary']
    this.state = {
      animating: false,
      pageIndex: 0,
      headerHeight: 0,
      bankOnboardingModalVisible: false,
      summarySubmitText: "Create user",
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      phone: null
    };
  }

  componentWillMount() {
    Mixpanel.timeEvent('User Onboarding');
  }

  toggleBankOnboardingModal() {
    this.setState({ bankOnboardingModalVisible: !this.state.bankOnboardingModalVisible });
  }

  createUser(cb) {
    //var nameBuffer = this.state.name.split(" ");
    this.props.currentUser.createUserWithEmailAndPassword({
      //firstName: nameBuffer.splice(0, 1).join(""),
      //lastName: nameBuffer.join(" "),
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      phone: this.state.phone
    },
    () => {
      Mixpanel.trackWithProperties('User Onboarding', {
        completed: true,
        cancelled: false,
        errCodes: (this.errCodes.length > 0) ? this.errCodes : "none",
        uid: this.props.currentUser.uid
      });
      this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates));
      this.toggleBankOnboardingModal();
      cb();
    },
    (errCode) => {
      this.errCodes.push({ errCode: errCode, timestamp: new Date().getTime() });
      Mixpanel.trackWithProperties('Failed User Creation', { errCode: errCode });
      if (errCode === "auth/email-already-in-use") {
        alert("This email is already in use.");
      } else {
        alert("Something went wrong on our end 🙄\n\nPlease try again");
        cb();
      }
    });
  }

  induceState(substate) {
    this.setState(substate, () => this.state.firstNameInput.focus());
  }

  focusInput() {
    let currPage = this.pages[this.state.pageIndex];
    switch (currPage) {
      case "name":
        this.state.firstNameInput.focus();
      break;
      case "email":
        this.state.emailInput.focus();
      break;
      case "password":
        this.state.passwordInput.focus();
      break;
      case "phone":
        this.state.phoneInput.focus();
      break;
      default:
        dismissKeyboard();
    }
  }

  nextPage(params) {
    if (this.state.animating) return;
    this.setState({ animating: true });

    this.setState({ pageIndex: this.state.pageIndex + 1 }, () => this.focusInput());

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value - dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start(() => this.setState({ animating: false }));
  }

  prevPage() {
    if (this.state.animating || this.state.pageIndex === 0) return;
    this.setState({ animating: true });

    this.setState({ pageIndex: this.state.pageIndex - 1 }, () => this.focusInput());

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value + dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start(() => this.setState({ animating: false }));
  }

  handleCancel() {
    Mixpanel.trackWithProperties('User Onboarding', {
      completed: false,
      cancelled: true,
      errCodes: (this.errCodes.length > 0) ? this.errCodes : "none"
    });

    if (typeof this.props.handleCancel === 'function') this.props.handleCancel();
    else Actions.LandingScreenViewContainer();
  }

  render() {
    return(
      <View style={{ flex: 1.0, backgroundColor: colors.richBlack }}>
        <StatusBar barStyle='light-content' />

        { /* Header */ }
        <View style={styles.headerWrap} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/Payper_logo_turqouise.png')} style={{ height: this.state.headerHeight * 0.9, width: (this.state.headerHeight * 0.9) * this.logoAspectRatio }} />
        </View>

        { /* Back button */ }
        <TouchableHighlight
          style={styles.backButton}
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => (this.state.pageIndex === 0) ? this.handleCancel() : this.prevPage()}>
          <Entypo color={colors.white} size={30} name={(this.state.pageIndex === 0) ? "cross" : "chevron-thin-left"} />
        </TouchableHighlight>

        { /* Inner content */ }
        <Animated.View style={[styles.allPanelsWrap, { marginLeft: this.offsetX, width: dimensions.width * 5 }]}>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Name nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Email nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Password nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Phone nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Summary
              nextPage={() => this.nextPage()}
              induceState={substate => this.induceState(substate)}
              createUser={(cb) => this.createUser(cb)}
              user={{firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password, phone: this.state.phone }} />
          </View>
        </Animated.View>

        { /* Bank onboarding modal */ }
        <Modal animationType={"slide"} visible={this.state.bankOnboardingModalVisible}>
          <View style={{ backgroundColor: colors.richBlack, flex: 1.0, width: dimensions.width }}>
            <BankOnboardingView {...this.props} displayCloseButton={false} />
          </View>
        </Modal>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  allPanelsWrap: {
    flexDirection: 'row',
    flex: 0.85
  },
  headerWrap: {
    flexDirection: 'row',
    flex: 0.15,
    width: dimensions.width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
  backButton: {
    position: 'absolute',
    top: 20, left: 0,
    height: dimensions.height * 0.15,
    width: dimensions.height * 0.15,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
