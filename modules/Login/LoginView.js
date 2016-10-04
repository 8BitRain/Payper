// Dependencies
import React from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';
import { VibrancyView } from 'react-native-blur';
import User from '../../classes/User';
import colors from '../../styles/colors';
import * as Validate from '../../helpers/Validate';

// Components
import StickyTextInput from './helperComponents/StickyTextInput';

// Screen dimensions
const dims = Dimensions.get('window');

export default class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginParams: { email: "", password: "" },
      validations: { email: false, password: false },
      errorMessage: null,
      modalVisible: false
    };

    this.User = new User({
      enableLogs:     true,
      onLoginSuccess: () => this.onLoginSuccess(),
      onLoginFailure: (res) => this.onLoginFailure(res)
    });
  }

  updateEmail(v) {
    this.state.loginParams.email = v;
    this.state.validations.email = Validate.email(v);
    this.setState({ loginParams: this.state.loginParams, validations: this.state.validations });
  }

  updatePassword(v) {
    this.state.loginParams.password = v;
    this.state.validations.password = Validate.password(v);
    this.setState({ loginParams: this.state.loginParams, validations: this.state.validations });
  }

  login() {
    this.setState({ loading: true });
    this.User.loginWithEmail(this.state.loginParams);
  }

  onLoginSuccess() {
    this.setState({ loading: false, errorMessage: null });
    console.log("Log in succeeded! User:", this.User);
  }

  onLoginFailure(errCode) {
    var errorMessage = null;
    switch (errCode) {
      case "auth/wrong-password":
        errorMessage = "Incorrect password";
      break;
      case "auth/user-not-found":
        errorMessage = "No user was found with that email address";
      break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
      break;
      case "lambda/exited-before-completion":
      case "lambda/timed-out":
        errorMessage = "There was an issue on our end (🙄)\nPlease try again";
      break;
    }
    this.setState({ loading: false, errorMessage: errorMessage });
  }

  toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  render() {
    return(
      <View style={styles.wrap}>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}>

          { /* Inputs */ }
          <StickyTextInput
            updateEmail={(v) => this.updateEmail(v)}
            updatePassword={(v) => this.updatePassword(v)}
            onSubmit={() => this.login()}
            toggleModal={() => this.toggleModal()}
            validations={this.state.validations}
            loading={this.state.loading}
            errorMessage={this.state.errorMessage} />

        </Modal>

        <Text style={{ fontSize: 20, color: colors.white }} onPress={() => this.toggleModal()}>
          Toggle modal
        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    height: dims.height,
    width: dims.width,
    backgroundColor: colors.richBlack,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
