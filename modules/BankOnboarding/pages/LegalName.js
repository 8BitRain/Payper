// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Validate from'../../../helpers/Validate';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class LegalName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      valid: Validate.name(this.props.firstName) && Validate.name(this.props.lastName),
      submitText: "Continue"
    };
  }

  componentDidMount() {
    this.props.induceState(this.refs);
  }

  handleSubmit() {
    if (!this.state.valid) return;
    this.props.induceState({ firstName: this.state.firstName, lastName: this.state.lastName });
    this.props.nextPage();
  }

  handleFirstNameChangeText(input) {
    var isValid = Validate.name(input) && Validate.name(this.state.lastName);
    this.setState({
      firstName: input,
      valid: isValid,
      submitText: (isValid) ?  "Continue" :  "Please enter a valid name"
    });
  }

  handleLastNameChangeText(input) {
    var isValid = Validate.name(input) && Validate.name(this.state.firstName);
    this.setState({
      lastName: input,
      valid: isValid,
      submitText: (isValid) ?  "Continue" :  "Please enter a valid name"
    });
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '400', color: colors.deepBlue, textAlign: 'center' }}>
            { "Is this your legal first and last name?" }
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            ref={"firstNameInput"}
            style={styles.input}
            defaultValue={this.state.firstName}
            autoCapitalize={"words"} autofocus autoCorrect={false}
            onChangeText={(input) => this.handleFirstNameChangeText(input)} />

          <TextInput
            style={styles.input}
            defaultValue={this.state.lastName}
            autoCapitalize={"words"} autofocus autoCorrect={false}
            onChangeText={(input) => this.handleLastNameChangeText(input)} />
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
    width: dimensions.width * 0.40,
    marginTop: 15,
    marginRight: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    color: colors.white
  }
});
