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
      valid: Validate.name(this.props.firstName) && Validate.name(this.props.lastName)
    };
  }

  handleSubmit() {
    if (!this.state.valid) return;
    this.props.induceState({ firstName: this.props.firstName, lastName: this.props.lastName });
    this.props.nextPage();
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "Is this your legal first and last name?" }
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            defaultValue={this.state.firstName}
            autoCapitalize={"words"} autofocus autoCorrect={false}
            onChangeText={(input) => this.setState({ firstName: input, valid: Validate.name(input) })} />

          <TextInput
            style={styles.input}
            defaultValue={this.state.lastName}
            autoCapitalize={"words"} autofocus autoCorrect={false}
            onChangeText={(input) => this.setState({ lastName: input, valid: Validate.name(input) })} />
        </View>

        <StickyView>
          <ContinueButton text={(this.state.valid) ? "Yes" : "Please enter a valid name."} onPress={() => this.handleSubmit()} />
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
    flexDirection: 'column',
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
  }
});
