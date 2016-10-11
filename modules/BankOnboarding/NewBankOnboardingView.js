// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Animated, Easing, Dimensions, StatusBar, Image } from "react-native";
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';
import dismissKeyboard from 'react-native-dismiss-keyboard';

// Helpers
import * as Headers from '../../helpers/Headers';

// Components
import Header from '../../components/Header/Header';
import Comfort from './newPages/Comfort';
import LegalName from './newPages/LegalName';
import ZIPCode from './newPages/ZIPCode';
import City from './newPages/City';
import Street from './newPages/Street';
import DateOfBirth from './newPages/DateOfBirth';
import Social from './newPages/Social';
import IAV from './newPages/IAV';

// Stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

export default class NewBankOnboardingView extends React.Component {
  constructor(props) {
    super(props);
    this.offsetX = new Animated.Value(0);
    this.logoAspectRatio = 377 / 568;
    this.state = {
      animating: false,
      pageIndex: 0,
      headerHeight: 0,
      closeButtonVisible: true,
      skipCityPage: true,
      name: null,
      zip: null,
      street: null,
      city: null,
      country: "United States",
      state: null,
      dob: null,
      ssn: null
    };

    this.currentUser = {
      firstName: "Brady",
      lastName: "Sheridan",
      token: "aosdf90qwjr0f9jfjas09fk30q29wjf",
      iavToken: "elhiN1wQI2tV3rNxVB6XYCDUKSa5ALGPgAOVt4xJMe1L5VBonC",
      dob: null
    }
  }

  induceState(substate) {
    this.setState(substate, () => {
      console.log("<BankOnboardingView /> state:\n", this.state);
    });
  }

  nextPage(params) {
    if (this.state.animating) return;
    this.setState({ animating: true });
    dismissKeyboard();

    this.setState({ pageIndex: this.state.pageIndex + 1 }, () => {
      if ((this.state.pageIndex - 1) === 0) this.toggleCloseButton();
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

  render() {
    return(
      <View style={{ flex: 1.0 }}>
        <StatusBar barStyle='light-content' />

        { /* Header */ }
        <View style={styles.headerWrap} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.4, width: (this.state.headerHeight * 0.4) * this.logoAspectRatio }} />
        </View>

        { /* Cancel or back button */ }
        <TouchableHighlight
          style={styles.backButton}
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => (this.state.closeButtonVisible) ? console.log("Closing modal...") : this.prevPage()}>
          <Entypo color={colors.white} size={30} name={(this.state.closeButtonVisible) ? "cross" : "chevron-thin-left"} />
        </TouchableHighlight>

        { /* Skip button */
          (this.state.pageIndex === 7)
            ? <TouchableHighlight
                style={styles.skipButton}
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => console.log("Skipping IAV...")}>
                <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
                  Skip
                </Text>
              </TouchableHighlight>
            : null }

        { /* Inner content */ }
        <Animated.View style={[styles.allPanelsWrap, { marginLeft: this.offsetX, width: dimensions.width * ((this.state.skipCityPage) ? 7 : 8) }]}>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Comfort nextPage={p => this.nextPage(p)} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <LegalName nextPage={p => this.nextPage(p)} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <ZIPCode nextPage={p => this.nextPage(p)} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>

          { (this.state.skipCityPage)
              ? null
              : <View style={{ flex: 1.0, width: dimensions.width }}>
                  <City nextPage={p => this.nextPage(p)} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
                </View> }

          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Street city={this.state.city} state={this.state.state} nextPage={p => this.nextPage(p)} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <DateOfBirth nextPage={p => this.nextPage(p)} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Social nextPage={p => this.nextPage(p)} induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <IAV induceState={substate => this.induceState(substate)} currentUser={this.currentUser} />
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
