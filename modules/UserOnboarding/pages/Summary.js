// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Validate from '../../../helpers/Validate';

// Components
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import {colors} from '../../../globalStyles';
const dimensions = Dimensions.get('window');

export default class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitText: "Sign me up!",
      passwordIsHidden: true,
      nameIsValid: this.props.user.firstName && Validate.name(this.props.user.firstName) && this.props.user.lastName && Validate.name(this.props.user.lastName),
      emailIsValid: Validate.email(this.props.user.email),
      passwordValidations: Validate.password(this.props.user.password),
      phoneValidations: Validate.phone(this.props.user.phone)
    }
  }

  componentWillReceiveProps(nextProps) {
    var nextState = {
      nameIsValid: this.props.user.firstName && Validate.name(this.props.user.firstName) && this.props.user.lastName && Validate.name(this.props.user.lastName),
      emailIsValid: Validate.email(nextProps.user.email),
      passwordValidations: Validate.password(nextProps.user.password),
      phoneValidations: Validate.phone(nextProps.user.phone)
    };
    nextState.submitText = (!nextState.nameIsValid) ? "Enter a valid name" : (!nextState.emailIsValid) ? "Enter a valid email address" : (!nextState.passwordValidations.isValid) ? "Enter a valid password" : (!nextState.phoneValidations.isValid) ? "Enter a valid phone number" : "Sign me up!";
    this.setState(nextState);
  }

  handleSubmit() {
    if (this.state.submitText !== "Sign me up!") return;
    this.setState({ submitText: "Creating user..." });
    this.props.createUser(() => {
      this.setState({ submitText: "Sign me up!" });
    });
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{  fontSize: 24, fontWeight: '400', color: colors.white, textAlign: 'center' }}>
            { "Does this look correct?" }
          </Text>
        </View>

        <View style={styles.attributesWrap}>
          <View>

            <View style={{ flexDirection: 'row', width: dimensions.width * 0.8, marginTop: 15 }}>
              <Entypo name={"user"} color={colors.accent} size={24} />
              <TextInput
                placeholder={"e.g. John Doe"}
                placeholderTextColor={colors.lightGrey}
                autoCapitalize={"words"} autoCorrect={false}
                onChangeText={input => this.props.induceState({ name: input.trim() })}
                defaultValue={this.props.user.firstName + " " + this.props.user.lastName}
                style={styles.input} />
            </View>

            <View style={{ flexDirection: 'row', width: dimensions.width * 0.8, marginTop: 15 }}>
              <Entypo name={"mail"} color={colors.accent} size={24} />
              <TextInput
                placeholder={"e.g. johndoe@example.com"}
                placeholderTextColor={colors.lightGrey}
                autoCapitalize={"none"} autoCorrect={false}
                keyboardType={"email-address"}
                onChangeText={input => this.props.induceState({ email: input.trim() })}
                defaultValue={this.props.user.email}
                style={styles.input} />
            </View>

            <View style={{ flexDirection: 'row', width: dimensions.width * 0.8, marginTop: 15 }}>
              <Entypo name={(this.state.passwordIsHidden) ? "eye" : "eye-with-line" } color={colors.accent} size={24} onPress={() => this.setState({ passwordIsHidden: !this.state.passwordIsHidden })} />
              <TextInput
                placeholder={"e.g. SeCur1ty!"}
                placeholderTextColor={colors.lightGrey}
                autoCapitalize={"none"} autoCorrect={false}
                secureTextEntry
                onChangeText={input => this.props.induceState({ password: input.trim() })}
                defaultValue={this.props.user.password}
                secureTextEntry={this.state.passwordIsHidden}
                style={styles.input} />
            </View>

            <View style={{ flexDirection: 'row', width: dimensions.width * 0.8, marginTop: 15 }}>
              <Entypo name={"phone"} color={colors.accent} size={24} />
              <TextInput
                placeholder={"e.g. 2623058038"}
                placeholderTextColor={colors.lightGrey}
                autoCapitalize={"none"} autoCorrect={false}
                keyboardType={"number-pad"}
                onChangeText={input => this.props.induceState({ phone: input.trim() })}
                maxLength={10}
                defaultValue={this.props.user.phone}
                style={styles.input} />
            </View>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <ContinueButton text={this.state.submitText} onPress={() => this.handleSubmit()} />
        </View>
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
    flex: 1.0,
    color: colors.white,
    paddingLeft: 30
  },
  attributesWrap: {
    width: dimensions.width * 0.8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 15
  }
});
