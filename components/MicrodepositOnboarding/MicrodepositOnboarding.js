// Dependencies
import React from 'react';
import { View, Text, TextInput, TouchableHighlight, Image, Dimensions, StatusBar } from 'react-native';
import { VibrancyView } from 'react-native-blur';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Lambda from '../../services/Lambda';

// Components
import StickyView from '../../classes/StickyView';

// Stylesheets
import colors from '../../styles/colors';
import styles from './styles';
const dimensions = Dimensions.get('window');

export default class MicrodepositOnboarding extends React.Component {
  constructor(props) {
    super(props);
    this.logoAspectRatio = 377 / 568;
    this.state = {
      submitText: "Next",
      amountOne: "",
      amountTwo: "",
      headerHeight: 0
    };
  }

  handleSubmit() {
    let valid = Number.parseFloat(this.state.amountOne) > 0 && Number.parseFloat(this.state.amountTwo) > 0;

    if (valid) {
      let params = { amount1: Number.parseFloat(this.state.amountOne), amount2: Number.parseFloat(this.state.amountTwo), token: "token" };
      this.setState({ submitText: "Verifying..." });
      Lambda.verifyMicrodeposits(params, (success) => {
        this.setState({ submitText: (success) ? "Verified!" : "We couldn't verify those amounts. Is there a typo?" });
        if (success) setTimeout(() => this.handleCancel(), 750);
      })
    } else {
      this.setState({ submitText: "Enter two valid amounts" });
    }
  }

  handleCancel() {
    if (typeof this.props.toggleModal === 'function') this.props.toggleModal();
    else console.log("<MicrodepositOnboarding /> was not supplied with a toggleModal() function.");
  }

  handleChangeText(input, whichAmount) {
    let valid = Number.parseFloat(input) > 0 && Number.parseFloat((whichAmount === 1) ? this.state.amountTwo : this.state.amountOne),
        newState = {};

    newState.submitText = (valid) ? "Continue" : "Enter two valid amounts";
    if (whichAmount === 1) newState.amountOne = input
    else newState.amountTwo = input;

    this.setState(newState, () => console.log(this.state));
  }

  render() {
    return(
      <View style={styles.wrap}>
        <StatusBar barStyle='light-content' />
        <VibrancyView blurType="dark" style={styles.blur} />

        { /* Logo */ }
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, height: dimensions.height * 0.2 }} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.4, width: (this.state.headerHeight * 0.4) * this.logoAspectRatio }} />
        </View>

        { /* Header */ }
        <View style={styles.headerWrap}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.handleCancel()}>

            <Entypo name={"cross"} size={24} color={colors.white} />

          </TouchableHighlight>
        </View>

        { /* Instructions */ }
        <View style={styles.textWrap}>
          <Text style={styles.text}>
            { "We made two small deposits to your bank account.\n\nEnter the amounts below." }
          </Text>
        </View>

        { /* Inputs */ }
        <View style={styles.inputWrap}>
          <View style={styles.amountWrap}>
            <Text style={styles.text}>
              { "1" }
            </Text>
          </View>

          <TextInput autoFocus
            style={[styles.input, styles.text]}
            placeholderTextColor={colors.white}
            placeholder={"$0.00"}
            keyboardType={"numeric"}
            onChangeText={(text) => this.handleChangeText(text, 1)} />

          <View style={styles.amountWrap}>
            <Text style={styles.text}>
              { "2" }
            </Text>
          </View>

          <TextInput
            style={[styles.input, styles.text]}
            placeholderTextColor={colors.white}
            placeholder={"$0.00"}
            keyboardType={"numeric"}
            onChangeText={(text) => this.handleChangeText(text, 2)} />
        </View>

        { /* Submit button */ }
        <StickyView>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.handleSubmit()}>

            <View style={styles.submitWrap}>
              <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
                { this.state.submitText }
              </Text>
            </View>

          </TouchableHighlight>
        </StickyView>
      </View>
    );
  }
}
