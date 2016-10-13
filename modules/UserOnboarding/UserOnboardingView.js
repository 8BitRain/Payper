// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Animated, Easing, Dimensions, StatusBar, Image, Modal } from "react-native";
import { Actions } from 'react-native-router-flux';
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
    this.state = {
      animating: false,
      pageIndex: 0,
      headerHeight: 0,
      bankOnboardingModalVisible: false,
      summarySubmitText: "Create user",
      name: null,
      email: null,
      password: null,
      phone: null
    };
  }

  toggleBankOnboardingModal() {
    this.setState({ bankOnboardingModalVisible: !this.state.bankOnboardingModalVisible });
  }

  createUser(cb) {
    var nameBuffer = this.state.name.split(" ");
    this.props.currentUser.createUserWithEmailAndPassword({
      firstName: nameBuffer.splice(0, 1).join(""),
      lastName: nameBuffer.join(" "),
      email: this.state.email,
      password: this.state.password,
      phone: this.state.phone
    },
    () => {
      this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates));
      this.toggleBankOnboardingModal();
      cb();
    },
    (errCode) => {
      if (errCode === "auth/email-already-in-use") {
        alert("This email is already in use.");
      } else {
        alert("Something went wrong on our end 🙄\n\nPlease try again");
        cb();
      }
    });
  }

  induceState(substate) {
    this.setState(substate);
  }

  nextPage(params) {
    if (this.state.animating) return;
    this.setState({ animating: true });
    dismissKeyboard();

    this.setState({ pageIndex: this.state.pageIndex + 1 });

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value - dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start(() => this.setState({ animating: false }));
  }

  prevPage() {
    if (this.state.animating || this.state.pageIndex === 0) return;
    this.setState({ animating: true });
    dismissKeyboard();

    this.setState({ pageIndex: this.state.pageIndex - 1 });

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value + dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start(() => this.setState({ animating: false }));
  }

  render() {
    return(
      <View style={{ flex: 1.0 }}>
        <StatusBar barStyle='light-content' />

        { /* Header */ }
        <View style={styles.headerWrap} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.4, width: (this.state.headerHeight * 0.4) * this.logoAspectRatio }} />
        </View>

        { /* Back button */ }
        <TouchableHighlight
          style={styles.backButton}
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => (this.state.pageIndex === 0) ? Actions.LandingScreenContainer() : this.prevPage()}>
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
              user={{ name: this.state.name, email: this.state.email, password: this.state.password, phone: this.state.phone }} />
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
