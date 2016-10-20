// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Validate from'../../../helpers/Validate';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class Password extends React.Component {
  constructor(props) {
    super(props);

    this.validationMessages = {
      isLongEnough: "> 7 characters",
      hasUppercase: "Uppercase letter",
      hasLowercase: "Lowercase letter",
      hasSymbol: "Symbol",
      hasNumber: "Number"
    };

    this.state = {
      password: "",
      submitText: "Please enter a valid password",
      passwordIsHidden: true,
      validations: {
        isLongEnough: false,
        hasUppercase: false,
        hasLowercase: false,
        hasSymbol: false,
        hasNumber: false,
        isValid: false
      }
    };
  }

  handleSubmit() {
    if (this.state.submitText !== "Continue") return;
    this.props.induceState({ password: this.state.password });
    this.props.nextPage();
  }

  handleChangeText(input) {
    var validations = Validate.password(input);

    this.setState({
      password: input,
      validations: validations,
      submitText: (validations.isValid) ? "Continue" : "Please enter a valid password",
    });
  }

  getValidationCheckBoxes() {
    var arr = [];

    for (var k in this.state.validations) {
      if (k === "isValid") continue;
      const key = k;
      const valid = this.state.validations[k];
      arr.push(
        <Text key={Math.random()} style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: (valid) ? colors.alertGreen : colors.alertRed }}>
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
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "Enter a secure password" }
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            defaultValue={this.state.name}
            placeholder={"e.g. SeCur1ty!"}
            placeholderTextColor={colors.lightGrey}
            autoCapitalize={"none"} autoCorrect={false}
            secureTextEntry={this.state.passwordIsHidden}
            onChangeText={(input) => this.handleChangeText(input)}
            onKeyPress={e => { if (e.nativeEvent.key === "Enter") this.handleSubmit() }} />

          <View style={{ position: 'absolute', top: 0, left: 8, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', marginTop: 15, height: 55, width: 40, backgroundColor: 'transparent' }}>
            <Entypo name={(this.state.passwordIsHidden) ? "eye" : "eye-with-line" } color={colors.accent} size={24} onPress={() => this.setState({ passwordIsHidden: !this.state.passwordIsHidden })} />
          </View>
        </View>

        <View style={styles.validationsWrap}>
          <View>
            { this.getValidationCheckBoxes() }
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
    backgroundColor: colors.richBlack,
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
    color: colors.white
  },
  validationsWrap: {
    width: dimensions.width * 1.0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  }
});