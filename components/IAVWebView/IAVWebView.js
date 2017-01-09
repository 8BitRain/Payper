import React from 'react'
import WebViewBridge from 'react-native-webview-bridge'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, WebView, Dimensions, StatusBar} from 'react-native'
import Mixpanel from 'react-native-mixpanel'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as config from '../../config'
import {colors} from '../../globalStyles'
import {Timer, TrackOnce} from '../../classes/Metrics'
const dimensions = Dimensions.get('window')

class IAVWebView extends React.Component {
  constructor(props) {
    super(props)

    this.payperEnv = config.details.env
    this.dwollaEnv = (config.details.env === "dev") ? "sandbox" : "prod"

    this.state = {
      cancelled: false,
      injectedJS: ""
    }
  }

  componentWillMount() {
    setTimeout(() => this.refresh(), 400)
    // this.refresh()
    this.timer = new Timer()
    this.trackOnce = new TrackOnce()
    this.timer.start()
  }

  componentWillUnmount() {
    this.timer.report("bankOnboarding", this.props.currentUser.uid, {
      uid: this.props.currentUser.uid
    })
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
    this.props.currentUser.getIAVToken({ token: this.props.currentUser.token }, (res) => {
      cb(res.IAVToken)
    })
  }

  generateInjectedJS(params, cb) {
    let {IAVToken, firebaseToken, dwollaEnv, payperEnv} = params

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
    this.setState({cancelled: true}, () => {
      (typeof this.props.toggleModal === 'function')
        ? this.props.toggleModal()
        : Actions.pop()
    })
  }

  onBridgeMessage(msg) {
    if (msg === "hello from webview") return
    
    let { webviewbridge } = this.refs
    let {onCompletion} = this.props

    let buffer = msg.split("-")
    let success = (buffer[0]) ? buffer[0] === "success" : undefined
    let verificationType = (buffer[1]) ? buffer[1].split(":")[1] : undefined

    if (typeof onCompletion === 'function')
      onCompletion(success, verificationType)
    else
      console.log("--> IAVWebView has been completed, but wasn't passed an 'onCompletion' prop.\nSuccess? " + success + "\n Verification type? " + verificationType)
  }

  render() {
    return(
      <View style={{flex: 1.0, marginTop: 20, backgroundColor: colors.accent}}>
        <View style={{flex: 0.1, backgroundColor: colors.accent, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 12.5, paddingRight: 12.5}}>
          { /* Header title */ }
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: dimensions.height * 0.1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: colors.snowWhite, textAlign: 'center'}}>
              { "Link Your\nBank Account" }
            </Text>
          </View>

          { /* Cancel button */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.handleCancel()}>

            <EvilIcons name={"close"} size={24} color={colors.snowWhite} />

          </TouchableHighlight>

          { /* Refresh button */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.refresh()}>

            <Text style={{fontSize: 16, color: colors.snowWhite, padding: 6, borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(255, 251, 252, 0.2)'}}>
              {"Refresh"}
            </Text>

          </TouchableHighlight>
        </View>
        <View style={{ flex: 0.9 }}>
          { /* Background */ }
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.accent }} />

          <WebViewBridge
            ref="webviewbridge"
            onBridgeMessage={(msg) => this.onBridgeMessage(msg)}
            javaScriptEnabled={true}
            injectedJavaScript={this.state.injectedJS}
            source={{uri: 'http://localhost:8080/iav'}} />

        </View>
      </View>
    )
  }
}

module.exports = IAVWebView
