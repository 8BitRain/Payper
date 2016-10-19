// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, WebView, Dimensions } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import config from '../../config';
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

export default class IAVWebView extends React.Component {
  constructor(props) {
    super(props);
    this.payperEnv = config.env;
    this.dwollaEnv = (config.env === "dev") ? "sandbox" : "prod";
    this.state = {
      injectedJS: "var firebase_token = '" + this.props.firebaseToken + "';" +
        "var iav_token = '" + this.props.IAVToken + "';" +
        "$(function() { generateIAVToken(\"" + this.dwollaEnv + "\", \"" + this.payperEnv + "\") });"
    }
    this.WEB_VIEW_REF = "IAVWebView";
  }

  componentDidMount() {
    console.log("IAVWebView mounted...");
    console.log("this.payperEnv", this.payperEnv);
    console.log("this.dwollaEnv", this.dwollaEnv);
    console.log("this.props.firebaseToken", this.props.firebaseToken);
    console.log("this.props.IAVToken", this.props.IAVToken);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.IAVToken !== this.props.IAVToken || nextProps.firebaseToken !== this.props.firebaseToken) {
      this.setState({
        injectedJS: "var firebase_token = '" + this.props.firebaseToken + "';" +
          "var iav_token = '" + this.props.IAVToken + "';" +
          "$(function() { generateIAVToken(\"" + this.dwollaEnv + "\", \"" + this.payperEnv + "\") });"
      }, () => this.refresh());
    }
  }

  handleError(err) {
    console.log("Error loading WebView:", err);
  }

  refresh(getNewIAVToken) {
    if (getNewIAVToken) this.props.currentUser.getIAVToken();
    this.refs[this.WEB_VIEW_REF].reload();
  }

  render() {
    if (this.props.refreshable) return(
      <View style={{ flex: 1.0, marginTop: 20 }}>
        <View style={{ flex: 0.1, backgroundColor: colors.richBlack, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 12.5, paddingRight: 12.5 }}>
          { /* Header title */ }
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: dimensions.height * 0.1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
              { "Link Your\nBank Account" }
            </Text>
          </View>

          { /* Cancel button */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.props.toggleModal()}>

            <Entypo name={"cross"} size={24} color={colors.white} />

          </TouchableHighlight>

          { /* Refresh button */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.refresh(true)}>

            <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: colors.white, padding: 6, borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              Refresh
            </Text>

          </TouchableHighlight>
        </View>
        <View style={{ flex: 0.9 }}>
          <WebView
            ref={this.WEB_VIEW_REF}
            source={{ uri: 'http://www.getpayper.io/iav' }}
            injectedJavaScript={this.state.injectedJS}
            startInLoadingState={false}
            onError={err => this.handleError(err)}  />
        </View>
      </View>
    );

    else return (
      <WebView
        ref={this.WEB_VIEW_REF}
        source={{ uri: 'http://www.getpayper.io/iav' }}
        injectedJavaScript={this.state.injectedJS}
        startInLoadingState={false}
        onError={err => this.handleError(err)}  />
    );
  }
}
