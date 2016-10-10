// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Animated, Easing, Dimensions, StatusBar, Image } from "react-native";
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Headers from '../../helpers/Headers';

// Components
import Header from '../../components/Header/Header';
import Comfort from './newPages/Comfort';
import LegalName from './newPages/LegalName';
import City from './newPages/City';
import PostalCode from './newPages/PostalCode';

// Stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

export default class NewBankOnboardingView extends React.Component {
  constructor(props) {
    super(props);
    this.offsetX = new Animated.Value(0);
    this.pages = ["comfort", "basic", "billingAddress", "DOB", "SSN", "IAV"];
    this.logoAspectRatio = 377 / 568;
    this.state = {
      pageIndex: 0,
      headerHeight: 0,
      closeButtonVisible: true
    };
  }

  induceState(substate) {
    this.setState(substate, () => {
      console.log("<BankOnboardingView /> state =", this.state);
    });
  }

  nextPage() {
    this.setState({ pageIndex: this.state.pageIndex + 1 }, () => {
      if ((this.state.pageIndex - 1) === 0) this.toggleCloseButton();
    });

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value - dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start();
  }

  prevPage() {
    this.setState({ pageIndex: this.state.pageIndex - 1 }, () => {
      if (this.state.pageIndex === 0) this.toggleCloseButton();
    });

    Animated.timing(this.offsetX, {
      toValue: this.offsetX._value + dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start();
  }

  toggleCloseButton() {
    this.setState({ closeButtonVisible: !this.state.closeButtonVisible });
  }

  render() {
    return(
      <View style={{ flex: 1.0 }}>
        <StatusBar barStyle="light-content" />

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

        { /* Inner content */ }
        <Animated.View style={[styles.allPanelsWrap, { marginLeft: this.offsetX }]}>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <Comfort nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <LegalName nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <City nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
          <View style={{ flex: 1.0, width: dimensions.width }}>
            <PostalCode nextPage={() => this.nextPage()} induceState={substate => this.induceState(substate)} />
          </View>
        </Animated.View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  allPanelsWrap: {
    flexDirection: 'row',
    flex: 0.85,
    width: dimensions.width * 4,
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
