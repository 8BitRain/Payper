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

export default class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email || "",
      valid: false,
      submitText: (this.props.email) ? "Continue" : "Please enter a valid email address"
    };
  }

  handleSubmit() {
    if (this.state.submitText !== "Continue") return;
    this.props.induceState({ email: this.state.email });
    this.props.nextPage();
  }

  handleChangeText(input) {
    var isValid = Validate.email(input);
    this.setState({
      email: input,
      valid: isValid,
      submitText: (isValid) ? "Continue" : "Please enter a valid email address"
    });
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "What's your email?" }
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            defaultValue={this.state.email}
            placeholder={"e.g. johndoe@example.com"}
            placeholderTextColor={colors.lightGrey}
            autoCapitalize={"none"} autoCorrect={false}
            keyboardType={"email-address"}
            onChangeText={(input) => this.handleChangeText(input)}
            onKeyPress={e => { if (e.nativeEvent.key === "Enter") this.handleSubmit() }} />
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
  }
});
