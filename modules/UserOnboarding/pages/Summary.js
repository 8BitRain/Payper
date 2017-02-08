// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import dismissKeyboard from 'react-native-dismiss-keyboard'

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
      name: null,
      email: null,
      password: null,
      phone: null,
      nameIsValid: this.props.user.firstName && Validate.name(this.props.user.firstName) && this.props.user.lastName && Validate.name(this.props.user.lastName),
      emailIsValid: Validate.email(this.props.user.email),
      passwordValidations: Validate.password(this.props.user.password),
      phoneValidations: Validate.phone(this.props.user.phone)
    }
  }

  componentWillReceiveProps(nextProps) {
    // var nextState = {
    //   nameIsValid: this.props.user.firstName && Validate.name(this.props.user.firstName) && this.props.user.lastName && Validate.name(this.props.user.lastName),
    //   emailIsValid: Validate.email(nextProps.user.email),
    //   passwordValidations: Validate.password(nextProps.user.password),
    //   phoneValidations: Validate.phone(nextProps.user.phone)
    // };
    // nextState.submitText = (!nextState.nameIsValid) ? "Enter a valid name" : (!nextState.emailIsValid) ? "Enter a valid email address" : (!nextState.passwordValidations.isValid) ? "Enter a valid password" : (!nextState.phoneValidations.isValid) ? "Enter a valid phone number" : "Sign me up!";
    // this.setState(nextState);
  }

  handleSubmit() {
    if (this.state.submitText !== "Sign me up!") return

    let {name, email, password, phone} = this.state

    this.setState({ submitText: "Creating user..." })

    let updatedState = {}
    if (name && name !== this.props.name && name.split(" ").length > 1)
      updatedState["name"] = name
    if (email && email !== this.props.email)
      updatedState["email"] = email
    if (password && password !== this.props.password)
      updatedState["password"] = password
    if (phone && phone !== this.props.phone)
      updatedState["phone"] = phone

    this.props.induceState(updatedState, () => {
      let validations = {
        nameIsValid: this.props.user.firstName && Validate.name(this.props.user.firstName) && this.props.user.lastName && Validate.name(this.props.user.lastName),
        emailIsValid: Validate.email(this.props.user.email),
        passwordValidations: Validate.password(this.props.user.password),
        phoneValidations: Validate.phone(this.props.user.phone)
      }

      if (!validations.nameIsValid) {
        Alert.alert('Wait!', 'Please enter a valid name.')
        this.setState({ submitText: "Sign me up!" })
        return
      }

      if (!validations.emailIsValid) {
        Alert.alert('Wait!', 'Please enter a valid email address.')
        this.setState({ submitText: "Sign me up!" })
        return
      }

      if (!validations.passwordValidations.isValid) {
        Alert.alert('Wait!', 'Please enter a valid password.')
        this.setState({ submitText: "Sign me up!" })
        return
      }

      if (!validations.phoneValidations.isValid) {
        Alert.alert('Wait!', 'Please enter a valid phone number.')
        this.setState({ submitText: "Sign me up!" })
        return
      }

      this.props.createUser(() => {
        this.setState({ submitText: "Sign me up!" })
      })
    })
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{  fontFamily: "Roboto", fontSize: 24, fontWeight: '400', color: colors.deepBlue, textAlign: 'center' }}>
            { "Does this look correct?" }
          </Text>
        </View>

        <View style={styles.attributesWrap}>
          <View>

            <View style={{ flexDirection: 'row', width: dimensions.width * 0.8, marginTop: 15 }}>
              <Entypo name={"user"} color={colors.accent} size={24} />
              <TextInput
                placeholder={"e.g. John Doe"}
                placeholderTextColor={colors.deepBlue}
                autoCapitalize={"words"} autoCorrect={false}
                onChangeText={input => this.setState({ name: input.trim() })}
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
                onChangeText={input => this.setState({ email: input.trim() })}
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
                onChangeText={input => this.setState({ password: input.trim() })}
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
                onChangeText={input => {
                  this.setState({ phone: input.trim() })
                  if (input.length === 10) dismissKeyboard()
                }}
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
    color: colors.deepBlue,
    paddingLeft: 30
  },
  attributesWrap: {
    width: dimensions.width * 0.8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 15
  }
});