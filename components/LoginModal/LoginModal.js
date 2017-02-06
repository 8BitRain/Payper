import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TextInput, Modal, StyleSheet, TouchableHighlight, Dimensions } from 'react-native'
import { VibrancyView } from 'react-native-blur'
import { signin } from '../../auth'
import { PasswordReset } from '../../components'
import User from '../../classes/User'
import { colors } from '../../globalStyles'
import * as Validate from '../../helpers/Validate'
import StickyTextInput from './subcomponents/StickyTextInput'
import DeviceInfo from 'react-native-device-info'
const dims = Dimensions.get('window')

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loginParams: { email: "", password: "" },
      validations: { email: false, password: false },
      errorMessage: null,
      passwordResetModalVisible: false
    }

    this.User = this.props.currentUser
  }

  updateEmail(v) {
    this.state.loginParams.email = v
    this.state.validations.email = Validate.email(v)
    this.setState({ loginParams: this.state.loginParams, validations: this.state.validations })
  }

  updatePassword(v) {
    this.state.loginParams.password = v
    this.state.validations.password = Validate.password(v)
    this.setState({ loginParams: this.state.loginParams, validations: this.state.validations })
  }

  login() {
    this.setState({ loading: true })
    let { email, password } = this.state.loginParams
    signin({
      email,
      pass: password,
      type: "generic"
    }, (res) => {
      if (!res.errCode) {
        this.props.currentUser.initialize(res)
        this.onLoginSuccess()
      } else {
        this.onLoginFailure(res.errCode)
      }
    })
  }

  onLoginSuccess() {
    this.setState({ loading: false, errorMessage: null })
    this.props.onLoginSuccess()
  }

  onLoginFailure(errCode) {
    var errorMessage = null

    switch (errCode) {
      case "auth/wrong-password":
        errorMessage = "Incorrect password"
      break
      case "auth/user-not-found":
        errorMessage = "No user was found with that email address"
      break
      case "auth/invalid-email":
        errorMessage = "Invalid email address"
      break
      case "auth/too-many-requests":
        errorMessage = "Too many login attempts. Please try again later"
      break
      case "lambda/exited-before-completion":
      case "lambda/timed-out":
      default:
        errorMessage = "There was an issue on our end 🙄\nPlease try again"
    }

    alert(errorMessage)
    this.setState({ loading: false, errorMessage: errorMessage })
  }

  togglePasswordResetModal() {
    this.setState({passwordResetModalVisible: !this.state.passwordResetModalVisible})
  }

  render() {
    return(
      <Modal animationType={"slide"} transparent={true} visible={this.props.modalVisible}>
        <StickyTextInput
          updateEmail={(v) => this.updateEmail(v)}
          updatePassword={(v) => this.updatePassword(v)}
          onSubmit={() => this.login()}
          toggleModal={() => this.props.toggleModal()}
          validations={this.state.validations}
          loading={this.state.loading}
          errorMessage={this.state.errorMessage}
          togglePasswordResetModal={() => this.togglePasswordResetModal()} />

        <Modal animationType={"slide"} visible={this.state.passwordResetModalVisible}>
          <PasswordReset close={() => this.togglePasswordResetModal()} />
        </Modal>
      </Modal>
    )
  }
}
