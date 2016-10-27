// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Animated, Easing, Dimensions, StatusBar, Image } from "react-native";
import { Actions } from 'react-native-router-flux';
import Mixpanel from 'react-native-mixpanel';
import Entypo from 'react-native-vector-icons/Entypo';
import dismissKeyboard from 'react-native-dismiss-keyboard';

// Helpers
import * as Headers from '../../helpers/Headers';
import * as Async from '../../helpers/Async';

// Components
import Header from '../../components/Header/Header';
import Comfort from './pages/Comfort';
import LegalName from './pages/LegalName';
import ZIPCode from './pages/ZIPCode';
import City from './pages/City';
import Street from './pages/Street';
import DateOfBirth from './pages/DateOfBirth';
import Social from './pages/Social';
import IAV from './pages/IAV';

// Stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

export default class BankOnboardingView extends React.Component {
  constructor(props) {
    super(props);
    this.offsetX = new Animated.Value(0);
    this.logoAspectRatio = 377 / 568;
    this.errCodes = [];
    this.state = {
      animating: false,
      pageIndex: 0,
      headerHeight: 0,
      closeButtonVisible: true,
      skipCityPage: true,
      firstName: null,
      lastName: null,
      zip: null,
      street: null,
      city: null,
      state: null,
      dob: null,
      ssn: null
    };
  }

  componentWillMount() {
    // Check for state cache
    Async.get('BankOnboardingStateCache', (cachedState) => {
      if (!cachedState) return;
      cachedState = JSON.parse(cachedState);

      // If this is a cached state from a different user's session, clear it
      if (cachedState.uid !== this.props.currentUser.uid) {
        Async.set('BankOnboardingStateCache', '');
        return;
      }

      cachedState.animating = false;
      cachedState.pageIndex = 0;
      cachedState.headerHeight = 0;
      cachedState.closeButtonVisible = true;
      cachedState.skipCityPage = true;
      this.setState(cachedState);
    });

    Mixpanel.timeEvent('Dwolla Customer Onboarding');
  }

  induceState(substate, cb) {
    this.setState(substate, (cb) => {
      if (substate.ssn) this.createDwollaCustomer(cb);
    });
  }

  createDwollaCustomer(cb) {
    var params = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      zip: this.state.zip,
      address: this.state.street,
      city: this.state.city,
      state: this.state.state,
      dob: this.state.dob.year + "-" + this.state.dob.month + "-" + this.state.dob.date,
      ssn: undefined
    };

    for (var k in params) if (!params[k]) {
      alert("Tried to create a Dwolla customer but " + k + " is undefined");
      return;
    }

    if (this.props.retry) this.props.currentUser.retryDwollaVerification(params,
      (customerStatus, cb) => this.handleSuccess(customerStatus, cb),
      (errCode, cb) => this.handleFailure(errCode, cb));
    else this.props.currentUser.createDwollaCustomer(params,
      (customerStatus, cb) => this.handleSuccess(customerStatus, cb),
      (errCode, cb) => this.handleFailure(errCode, cb));
  }

  /**
    *   Handle successful Dwolla customer creation
  **/
  handleSuccess(customerStatus, cb) {
    // If KYC failed due to retry status, cache this onboarding session
    if (customerStatus === "retry") {
      this.state.uid = this.props.currentUser.uid;
      Async.set('BankOnboardingStateCache', JSON.stringify(this.state));
    } else {
      Async.set('BankOnboardingStateCache', '');
    }

    // Track this onboarding session in Mixpanel
    Mixpanel.trackWithProperties('Dwolla Customer Onboarding', {
      completed: true,
      cancelled: false,
      errCodes: (this.errCodes.length > 0) ? this.errCodes : "none",
      uid: this.props.currentUser.uid,
      customerStatus: customerStatus
    });

    // Exit onboarding flow
    setTimeout(() => {
      if (typeof this.props.closeModal === 'function')
        this.props.closeModal();
      else
        Actions.MainViewContainer();
    }, 500);

    if (typeof cb === 'function') cb(true);
  }

  /**
    *   Handle failed Dwolla customer creation
  **/
  handleFailure(errCode, cb) {
    this.errCodes.push({ errCode: errCode, timestamp: new Date().getTime() });
    Mixpanel.trackWithProperties('Failed Dwolla Customer Creation', { errCode: errCode });
    alert("Something went wrong on our end 🙄\nPlease try again");
    if (typeof cb === 'function') cb(false);
  }

  nextPage() {
    if (this.state.animating) return;
    this.setState({ animating: true });
    dismissKeyboard();

    this.setState({ pageIndex: this.state.pageIndex + 1 }, () => {
      // Only show the close button on first page
      if ((this.state.pageIndex - 1) === 0)
        this.toggleCloseButton();
    });

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value - dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start(() => this.setState({ animating: false }));
  }

  prevPage() {
    if (this.state.animating) return;
    this.setState({ animating: true });
    dismissKeyboard();

    this.setState({ pageIndex: this.state.pageIndex - 1 }, () => {
      if (this.state.pageIndex === 0) this.toggleCloseButton();
    });

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value + dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start(() => this.setState({ animating: false }));
  }

  toggleCloseButton() {
    this.setState({ closeButtonVisible: !this.state.closeButtonVisible });
  }

  handleCancel() {
    Mixpanel.trackWithProperties('Dwolla Customer Onboarding', {
      completed: false,
      cancelled: true,
      errCodes: (this.errCodes.length > 0) ? this.errCodes : "none",
      uid: this.props.currentUser.uid
    });

    this.props.closeModal();
  }

  render() {
    return(
      <View style={{ flex: 1.0 }}>
        <StatusBar barStyle='light-content' />

        { /* Header */ }
        <View style={styles.headerWrap} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.4, width: (this.state.headerHeight * 0.4) * this.logoAspectRatio }} />
        </View>

        { /* Cancel or back button */
          (!this.props.displayCloseButton && this.state.pageIndex === 0)
            ? null
            : <TouchableHighlight
                style={styles.backButton}
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => (this.state.closeButtonVisible) ? (this.props.closeModal) ? this.handleCancel() : console.log("BankOnboardingView was not supplied with a closeModal function") : this.prevPage()}>
                <Entypo color={colors.white} size={30} name={(this.state.closeButtonVisible) ? "cross" : "chevron-thin-left"} />
              </TouchableHighlight> }

        { /* Inner content */ }
        <Animated.View style={[styles.allPanelsWrap, { marginLeft: this.offsetX, width: dimensions.width * ((this.state.skipCityPage) ? 6 : 7) }]}>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Comfort retry={this.props.retry} nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <LegalName nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} firstName={this.props.currentUser.first_name} lastName={this.props.currentUser.last_name} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <ZIPCode zip={this.state.zip} nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>

          { (this.state.skipCityPage)
              ? null
              : <View style={{ flex: 1.0, width: dimensions.width }}>
                  <City city={this.state.city} nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
                </View> }

          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Street street={this.state.street} city={this.state.city} state={this.state.state} nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <DateOfBirth dob={this.state.dob} nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Social requireAllDigits={this.props.retry} nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
        </Animated.View>
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
  },
  skipButton: {
    position: 'absolute',
    top: 20, right: 0,
    height: dimensions.height * 0.15,
    width: dimensions.height * 0.15,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
