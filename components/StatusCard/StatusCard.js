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

    this.config = {
      'need-bank': {
        message: "need-bank",
        pressable: true,
        modalContent:
          <View style={{flex: 1.0, backgroundColor: colors.accent}}>
            <IAVWebView refreshable currentUser={this.props.currentUser} toggleModal={() => this.toggleModal()} />
          </View>
      },
      'need-kyc': {
        message: "need-kyc"
      },
      'kyc-retry': {
        message: "kyc-retry"
      },
      'kyc-documentNeeded': {
        message: "kyc-documentNeeded"
      },
      'kyc-documentProcessing': {
        message: "kyc-documentProcessing"
      },
      'kyc-documentReceived': {
        message: "kyc-documentReceived"
      },
      'kyc-suspended': {
        message: "kyc-suspended"
      },
      'microdeposits-initialized': {
        message: "microdeposits-initialized"
      },
      'microdeposits-deposited': {
        message: "microdeposits-deposited"
      },
      'microdeposits-failed':{
        message: "microdeposits-failed)"
      }
    }

    let onboardingProgress = props.currentUser.appFlags['onboarding-progress']

    this.state = {
      pressable: (this.config[onboardingProgress]) ? this.config[onboardingProgress].pressable : false,
      modalContent: (this.config[onboardingProgress]) ? this.config[onboardingProgress].modalContent : <View />,
      modalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    let currOnboardingProgress = this.props.currentUser.appFlags['onboarding-progress']
    let newOnboardingProgress = nextProps.currentUser.appFlags['onboarding-progress']

    if (currOnboardingProgress !== newOnboardingProgress) {
      this.setState({
        pressable: (this.config[newOnboardingProgress]) ? this.config[newOnboardingProgress].pressable : false,
        modalContent: (this.config[newOnboardingProgress]) ? this.config[newOnboardingProgress].modalContent : <View />
      })
    }
  }

  toggleModal() {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  handlePress() {
    if (!this.state.pressable) return
    this.toggleModal()
  }

  render() {
    let {modalVisible, modalContent} = this.state
    let onboardingProgress = this.props.currentUser.appFlags['onboarding-progress']
    let message = (this.config[onboardingProgress]) ? this.config[onboardingProgress].message : "'" + onboardingProgress + "' is not a valid value for the 'onboarding-progress' appFlag"

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
