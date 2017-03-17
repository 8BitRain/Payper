import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, WebView, Dimensions, StatusBar, Modal, StyleSheet} from 'react-native'
import {colors} from '../../globalStyles'
import {AddBankAccountTooltip} from '../../components/Tooltips'
import {getIAVToken} from '../../helpers/lambda'
import WebViewBridge from 'react-native-webview-bridge'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'
import config from '../../config'
import * as dispatchers from '../Main/MainState'

const dimensions = Dimensions.get('window')

class IAVModal extends React.Component {
  constructor(props) {
    super(props)

    this.payperEnv = config.env
    this.dwollaEnv = (config.env === "dev") ? "sandbox" : "prod"

    this.state = {
      cancelled: false,
      injectedJS: "",
      openTooltip: false
    }
  }

  componentWillMount() {
    this.refresh()
  }

  toggleTooltip(toggle) {
    this.setState({openTooltip: toggle})
  }

  handleError(err) {
    this.trackOnce.report("failedIAVLoad", this.props.currentUser.uid)
  }

  refresh() {
    this.getIAVToken((IAVToken) => {
      this.generateInjectedJS({
        IAVToken: IAVToken,
        firebaseToken: this.props.currentUser.token,
        dwollaEnv: this.dwollaEnv,
        payperEnv: this.payperEnv
      }, () => {
        this.refs.webviewbridge.reload()
      })
    })
  }

  getIAVToken(cb) {
    getIAVToken({token: this.props.currentUser.token}, (res) => {
      cb(res.IAVToken)
    })
  }

  generateInjectedJS(params, cb) {
    let {IAVToken, firebaseToken, dwollaEnv, payperEnv} = params

    console.log("--> Generating injected JS")
    console.log("--> IAVToken", IAVToken)
    console.log("--> firebaseToken", firebaseToken)
    console.log("--> dwollaEnv", dwollaEnv)
    console.log("--> payperEnv", payperEnv)

    let injectedJS = `
      $(function() {
        if (WebViewBridge) {
          WebViewBridge.onMessage = function (message) {
            if (message === "hello from react-native") {
              WebViewBridge.send("got the message inside webview");
            }
          };
          WebViewBridge.send("hello from webview");
        }

        generateIAVSession("` + IAVToken + `", "` + firebaseToken + `", "` + dwollaEnv + `", "` + payperEnv + `");
      })
    `

    this.setState({ injectedJS: injectedJS }, () => {
      if (typeof cb === 'function') cb()
    })
  }

  handleCancel() {
    if (this.props.currentUser.fundingSource) {
      let userIsVerified = this.props.currentUser.appFlags.customer_status === "verified"

      Actions.BankAccountAdded({
        currentUser: this.props.currentUser,
        shouldShowAccountVerification: !userIsVerified,
        verifyAccountDestination: Actions.KYCOnboardingView
      })
    } else {
      Actions.pop()
    }
  }

  onBridgeMessage(msg) {
    if (msg === "hello from webview") return

    let {webviewbridge} = this.refs
    let {onCompletion, currentUser} = this.props
    let buffer = msg.split("-")
    let success = (buffer[0]) ? buffer[0] === "success" : undefined
    let verificationType = (buffer[1]) ? buffer[1].split(":")[1] : undefined

    if (true === success) {
      if (verificationType === "microdeposits") {
        Actions.MicrodepositTooltip()
      } else {
        let userIsVerified = this.props.currentUser.appFlags.customer_status === "verified"

        Actions.BankAccountAdded({
          currentUser: this.props.currentUser,
          shouldShowAccountVerification: !userIsVerified,
          verifyAccountDestination: Actions.KYCOnboardingView
        })
      }
    }
  }

  render() {
    return(
      <View style={{flex: 1.0, paddingTop: 20, backgroundColor: colors.accent}}>
        <View style={{flex: 0.1, backgroundColor: colors.accent, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 12.5, paddingRight: 12.5}}>

          { /* Header title */ }
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: dimensions.height * 0.1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: colors.snowWhite, textAlign: 'center'}}>
              {"Link Your\nBank Account"}
            </Text>
          </View>

          { /* Cancel button */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.handleCancel()}>
            <EvilIcons name={"close"} size={24} color={colors.snowWhite} />
          </TouchableHighlight>

          { /* Add Bank Account Tooltip */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {this.toggleTooltip(true)}}>
            <Ionicons size={32} name="ios-help-circle" color={colors.snowWhite} />
          </TouchableHighlight>
        </View>

        { /* Background and WebViewBridge */ }
        <View style={{ flex: 0.9 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.accent }} />

          <WebViewBridge
            ref="webviewbridge"
            onBridgeMessage={(msg) => this.onBridgeMessage(msg)}
            javaScriptEnabled={true}
            injectedJavaScript={this.state.injectedJS}
            source={{uri: 'https://www.getpayper.io/iav'}} />
        </View>

        { /* Add Bank Account Tooltip */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.openTooltip}>
          <AddBankAccountTooltip toggleTooltip={(value) => this.toggleTooltip(value)}/>
        </Modal>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentUser: (input) => dispatch(dispatchers.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(IAVModal)
