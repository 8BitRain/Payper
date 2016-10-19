// Dependencies
import React from 'react';
import { WebView } from 'react-native';
import config from '../../config';

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.IAVToken !== this.props.IAVToken || nextProps.firebaseToken !== this.props.firebaseToken) {
      this.setState({
        injectedJS: "var firebase_token = '" + this.props.firebaseToken + "';" +
          "var iav_token = '" + this.props.IAVToken + "';" +
          "$(function() { generateIAVToken(\"" + this.dwollaEnv + "\", \"" + this.payperEnv + "\") });"
      }, () => this.refs[this.WEB_VIEW_REF].reload());
    }
  }

  handleError(err) {
    console.log("Error loading WebView:", err);
  }

  render() {
    return (
      <WebView
        ref={this.WEB_VIEW_REF}
        source={{ uri: 'http://www.getpayper.io/iav' }}
        injectedJavaScript={this.state.injectedJS}
        startInLoadingState={false}
        onError={err => this.handleError(err)}  />
    );
  }
}
