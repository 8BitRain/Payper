// Dependencies
import React from 'react'
import { View, Text, TouchableHighlight, WebView, Dimensions, StatusBar } from 'react-native'
import Mixpanel from 'react-native-mixpanel'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as config from '../../config'
import { colors } from '../../globalStyles'
import { Timer, TrackOnce } from '../../classes/Metrics'
const dimensions = Dimensions.get('window')

class IAVWebView extends React.Component {
  constructor(props) {
    super(props)

    this.WEB_VIEW_REF = "IAVWebView"
    this.payperEnv = config.details.env
    this.dwollaEnv = (config.details.env === "dev") ? "sandbox" : "prod"

    this.state = {
      cancelled: false,
      injectedJS: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("--> IAVWebView will receive props\n", nextProps)
  }

  componentWillMount() {
    this.refresh()
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
        this.refs[this.WEB_VIEW_REF].reload()
      })
    })
  }

  getIAVToken(cb) {
    this.props.currentUser.getIAVToken({ token: this.props.currentUser.token }, (res) => {
      cb(res.IAVToken)
    })
  }

  generateInjectedJS(params, cb) {
    let injectedJS = "$(function() { generateIAVSession(\"" + params.IAVToken + "\", \"" + params.firebaseToken + "\", \"" + params.dwollaEnv + "\", \"" + params.payperEnv + "\") })"
    this.setState({ injectedJS: injectedJS }, () => {
      if (typeof cb === 'function') cb()
    })
  }

  render() {
    if (this.props.refreshable) return(
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
            onPress={() => this.setState({ cancelled: true }, () => this.props.toggleModal())}>

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

          <WebView
            ref={this.WEB_VIEW_REF}
            source={{ uri: 'http://www.getpayper.io/iav' }}
            injectedJavaScript={this.state.injectedJS}
            startInLoadingState={false}
            onError={err => this.handleError(err)}  />
        </View>
      </View>
    )

    else return (
      <WebView
        ref={this.WEB_VIEW_REF}
        source={{ uri: 'http://www.getpayper.io/iav' }}
        injectedJavaScript={this.state.injectedJS}
        startInLoadingState={false}
        onError={err => this.handleError(err)}  />
    )
  }
}

module.exports = IAVWebView
