import React from 'react'
import { View, Text, TouchableHighlight, Animated, Easing, Dimensions, Modal } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { colors } from '../../globalStyles'
import { IAVWebView } from '../index'
const dims = Dimensions.get('window')

class StatusCard extends React.Component {
  constructor(props) {
    super(props)

    this.messages = {
      "need": {
        "bank": "Press to add your bank account.",
        "kyc": "Press to verify your bank accont."
      },
      "kyc": {
        "retry": "We need you to double check your security questions.",
        "documentNeeded": "Additional documents are needed to verify your bank account.",
        "documentProcessing": "We're verifying your bank account. Hang tight! (ETA: 3 days)",
        "documentReceived": "We're verifying your bank account. Hang tight! (ETA: 1 day)",
        "suspended": "It's taking us a little longer than expected to verify your bank account. Hang tight!"
      },
      "microdeposits": {
        "initialized": "Your microdeposits will arrive in 1-3 business days.",
        "deposited": "Your microdeposits have landed! Press to verify your bank account.",
        "failed": "Your microdeposits failed to land. Please re-link your bank account. (Be sure to enter the correct routing and account number!)"
      }
    }

    this.state = {
      pressable: props.pressable || true,
      modalContent: this.getModalContent(props.currentUser.appFlags['onboarding-progress']),
      modalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    let currOnboardingProgress = this.props.currentUser.appFlags['onboarding-progress']
    let newOnboardingProgress = nextProps.currentUser.appFlags['onboarding-progress']
    
    if (currOnboardingProgress !== newOnboardingProgress) {
      let modalContent = this.getModalContent(newOnboardingProgress)
      this.setState({modalContent: modalContent})
    }
  }

  toggleModal() {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  getModalContent(onboardingProgress) {
    // TODO: Flesh out this switch statement
    switch (onboardingProgress) {
      case "need-bank": return <View style={{flex: 1.0, backgroundColor: colors.accent}}><IAVWebView refreshable currentUser={this.props.currentUser} toggleModal={() => this.toggleModal()} /></View>
      case "need-kyc": return <View />
      case "need-documentNeeded": return <View />
      case "need-documentFailed": return <View />
      case "microdeposits-deposited": return <View />
      case "microdeposits-failed": return <View />
      default: return <TouchableHighlight onPress={() => this.setState({modalVisible: false})} style={{flex: 1.0}}><View style={{flex: 1.0, backgroundColor: colors.carminePink}} /></TouchableHighlight>
    }
  }

  handlePress() {
    if (!this.state.pressable) return
    this.toggleModal()
  }

  getMessage() {
    let onboardingProgress = this.props.currentUser.appFlags["onboarding-progress"] || ""
    let buffer = onboardingProgress.split("-")
    let cat = buffer[0]
    let key = buffer[1]

    let message = (undefined === this.messages[cat] || undefined === this.messages[cat][key])
      ? "App flag is undefined..."
      : this.messages[cat][key]

    return message
  }

  render() {
    let {modalVisible, modalContent} = this.state
    let message = this.getMessage()

    return(
      <View>
        <TouchableHighlight
          activeOpacity={(this.state.pressable) ? 0.75 : 1.0}
          underlayColor={'transparent'}
          onPress={() => this.handlePress()}>
          <View style={{width: dims.width, padding: 15, backgroundColor: colors.maastrichtBlue, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

            { /* Text */ }
            <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, color: colors.snowWhite}}>
                {message}
              </Text>
            </View>

            { /* Icon */ }
            <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            {(this.state.pressable)
              ? <EvilIcons name={"chevron-right"} color={colors.snowWhite} size={26} />
              : null }
            </View>

          </View>
        </TouchableHighlight>

        { /* Actionable status cards toggle this modal */ }
        <Modal visible={modalVisible} animationType={'slide'}>
          {modalContent}
        </Modal>
      </View>
    )
  }
}

module.exports = StatusCard
