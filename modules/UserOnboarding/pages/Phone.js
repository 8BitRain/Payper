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

export default class Phone extends React.Component {
  constructor(props) {
    super(props);

    this.validationMessages = { isCorrectLength: "10 digits" };

    this.state = {
      phone: "",
      submitText: "Please enter a valid phone number",
      validations: {
        isCorrectLength: false,
        isValid: false
      }
    };
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
            { "What's your phone number?" }
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            defaultValue={this.state.name}
            placeholder={"e.g. 2623058038"}
            placeholderTextColor={colors.lightGrey}
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