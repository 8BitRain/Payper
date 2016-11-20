// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Image, StatusBar } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Validate from'../../../helpers/Validate';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import {colors} from '../../../globalStyles';
const dimensions = Dimensions.get('window');

export default class Phone extends React.Component {
  constructor(props) {
    super(props);

    this.validationMessages = { isCorrectLength: "10 digits" };
    this.logoAspectRatio = 377 / 568;

    this.state = {
      headerHeight: 0,
      phone: "",
      submitText: "Please enter a valid phone number",
      validations: {
        isCorrectLength: false,
        isValid: false
      }
    };
  }

  componentDidMount() {
    this.props.induceState(this.refs);
  }

  handleSubmit() {
    if (this.state.submitText !== "Continue") return;
    this.props.induceState({ phone: this.state.phone });
    this.props.nextPage();
  }

  handleChangeText(input) {
    var validations = Validate.phone(input);

    this.setState({
      phone: input,
      validations: validations,
      submitText: (validations.isValid) ? "Continue" : "Please enter a valid phone number",
    });
  }

  getValidationCheckBoxes() {
    var arr = [];

    for (var k in this.state.validations) {
      if (k === "isValid") continue;
      const key = k;
      const valid = this.state.validations[k];
      arr.push(
        <Text key={Math.random()} style={{ fontSize: 16, fontWeight: '400', color: (valid) ? colors.alertGreen : colors.alertRed }}>
          <Entypo name={(valid) ? "thumbs-up" : "thumbs-down"} color={(valid) ? colors.alertGreen : colors.alertRed} size={14} />
          { "  " + this.validationMessages[key] }
        </Text>
      );
    }

    return arr;
  }

  render() {
    return (
      <View style={styles.wrap}>
        <StatusBar barStyle='light-content' />

        { /* Header is rendered if we're onboarding phone number by itself
          (outside of the full user onboarding flow) */
          (this.props.showHeader)
            ? <View style={styles.headerWrap} onLayout={(e) => this.setState({ headerHeight: e.nativeEvent.layout.height})}>
                <Image source={require('../../../assets/images/logo.png')} style={{ height: this.state.headerHeight * 0.4, width: (this.state.headerHeight * 0.4) * this.logoAspectRatio }} />
              </View>
            : null }


        <View style={{ flex: (this.props.showHeader) ? 0.85 : 1.0 }}>
          <View>
            <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '400', color: colors.deepBlue, textAlign: 'center', paddingLeft: 10, paddingRight: 10 }}>
              { "What's your phone number?" }
            </Text>
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              ref={"phoneInput"}
              style={styles.input}
              defaultValue={this.state.name}
              placeholder={"e.g. 2623058038"}
              placeholderTextColor={colors.deepBlue}
              autoCapitalize={"none"} autoCorrect={false}
              keyboardType={"number-pad"}
              onChangeText={(input) => this.handleChangeText(input)}
              maxLength={10}
              onKeyPress={e => { if (e.nativeEvent.key === "Enter") this.handleSubmit() }} />
          </View>

          <View style={styles.validationsWrap}>
            <View>
              { this.getValidationCheckBoxes() }
            </View>
          </View>
        </View>

        <StickyView>
          <ContinueButton text={this.state.submitText} onPress={() => this.handleSubmit()} />
        </StickyView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.snowWhite,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  },
  inputWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 55,
    width: dimensions.width * 0.75,
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    color: colors.deepBlue
  },
  validationsWrap: {
    width: dimensions.width * 1.0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  headerWrap: {
    flexDirection: 'row',
    flex: 0.15,
    width: dimensions.width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
});
