import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Animated, Easing, Dimensions, Modal, Image, StyleSheet } from 'react-native'
import { colors } from '../../globalStyles'
import { IAVWebView, KYCOnboardingView } from '../index'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
//Custom
const dimensions = Dimensions.get('window');
let imageDims = { width: 56, height: 56 }

class StatusCard extends React.Component {
  constructor(props) {
    super(props)

    this.config = {
      'need-bank': {
        message: "need-bank",
        action: "Add Bank",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent
        })
      },
      'need-kyc': {
        message: "need-kyc",
        pressable: true,
        destination: () => Actions.GlobalModal({
          subcomponent: <KYCOnboardingView currentUser={this.props.currentUser} />,
          backgroundColor: colors.accent,
          showHeader: true,
          title: "Bank Account Verification"
        })
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
        message: "microdeposits-failed"
      }
    }

    //let onboardingProgress = props.currentUser.appFlags['onboardingProgress']
    let onboardingProgress = 'need-bank'

    this.state = {
      pressable: (this.config[onboardingProgress]) ? this.config[onboardingProgress].pressable : false,
      modalContent: (this.config[onboardingProgress]) ? this.config[onboardingProgress].modalContent : <View />
    }
  }

  componentWillReceiveProps(nextProps) {
    //let currOnboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    //let newOnboardingProgress = nextProps.currentUser.appFlags['onboardingProgress']
    let currOnboardingProgress = 'need-bank'
    let newOnboardingProgress = 'need-bank'

    if (currOnboardingProgress !== newOnboardingProgress) {
      this.setState({
        pressable: (this.config[newOnboardingProgress]) ? this.config[newOnboardingProgress].pressable : false,
        modalContent: (this.config[newOnboardingProgress]) ? this.config[newOnboardingProgress].modalContent : <View />
      })
    }
  }

  handlePress(destination) {
    if (!this.state.pressable) return
    (typeof destination === 'function') ? destination() : null
  }

  _renderPicWithInitials(initials){
    return(
      <View style={styles.imageWrap}>
          { /*Profile pic with initials*/ }
          <View style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
              {initials}
            </Text>
          </View>
      </View>
    )
  }

  render() {
    let {modalContent} = this.state
    //let onboardingProgress = this.props.currentUser.appFlags['onboardingProgress']
    let onboardingProgress = 'need-bank'
    let message = (this.config[onboardingProgress]) ? this.config[onboardingProgress].message : "'" + onboardingProgress + "' is not a valid value for the 'onboardingProgress' appFlag"
    let destination = (this.config[onboardingProgress]) ? this.config[onboardingProgress].destination : null

    return(
      <View style={styles.wrapper}>
        {/* //TODO Close Modal Floating Points Move this to outside of wrapper*/}
        {/* Header */}
        <View style={{flex: 1, justifyContent: "flex-start", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden", marginTop: 5}}>
          {/* Profile Picture & Onboarding Progress Text*/}
          <View style={{flex: 1, alignItems: "center"}}>
            {this._renderPicWithInitials("ES")}
            <Text style={styles.text}>{"Eric's Onboarding Progress"}</Text>
          </View>
          {/* Unlocked Features*/}
          <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
            <View style={{flex: 1, alignItems: "center"}}>
              <Ionicons size={24} name="md-lock" color={colors.snowWhite} />
              <Text style={styles.text}>{"Send Money"}</Text>
            </View>
            <View style={{flex: 1, alignItems: "center"}}>
              <Ionicons size={24} name="md-lock" color={colors.snowWhite} />
              <Text style={styles.text}>{"Recieve Money"}</Text>
            </View>
          </View>
        </View>
        {/* Body */}
        {/*Footer*/}
        <View style={{flex: 1, justifyContent: "flex-end", alignItems: "center", borderRadius: dimensions.width / 32.0, overflow: "hidden"}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => console.log("Close Modal")}
            style={{height: 50, width: dimensions.width * .84, backgroundColor: colors.lightAccent, justifyContent: "center"}}>

                <Text style={styles.buttonText}>{this.config['need-bank'].action}</Text>
          </TouchableHighlight>
        </View>
    </View>
    )
  }
}

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.accent,
    margin: dimensions.width * .08,
    marginTop: dimensions.height * .25,
    marginBottom: dimensions.height * .25,
    borderRadius: dimensions.width / 32.0,
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    backgroundColor: colors.snowWhite,
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  buttonText:{
    color: '#fff',
    fontSize: 18,
    lineHeight: 18 * 1.20,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center"
  },
  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500"
  },
  text2: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16 * 1.20,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 15
  },
  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18 * 1.20
  },
  footer: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14 * 1.20,
    textAlign: "center",
    fontWeight: "300"
  }
});

module.exports = StatusCard
