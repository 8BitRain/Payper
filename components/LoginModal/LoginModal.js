// Dependencies
import React from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TextInput, Modal, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';
import { VibrancyView } from 'react-native-blur';
import User from '../../classes/User';
import colors from '../../styles/colors';
import * as Validate from '../../helpers/Validate';

// Components
import StickyTextInput from './subcomponents/StickyTextInput';

// Screen dimensions
const dims = Dimensions.get('window');

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginParams: { email: "", password: "" },
      validations: { email: false, password: false },
      errorMessage: null
    };

    this.User = this.props.currentUser;
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
    this.User.loginWithEmail(this.state.loginParams, () => this.onLoginSuccess(), () => this.onLoginFailure());
  }

  onLoginSuccess() {
    this.setState({ loading: false, errorMessage: null });
    Actions.MainViewContainer();
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

  render() {
    return(
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.modalVisible}>

        { /* Inputs */ }
        <StickyTextInput
          updateEmail={(v) => this.updateEmail(v)}
          updatePassword={(v) => this.updatePassword(v)}
          onSubmit={() => this.login()}
          toggleModal={() => this.props.toggleModal()}
          validations={this.state.validations}
          loading={this.state.loading}
          errorMessage={this.state.errorMessage} />

      </Modal>
    );
  }
}
