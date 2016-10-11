// Dependencies
import React from 'react';
import { WebView } from 'react-native';

export default class IAVWebView extends React.Component {
  constructor(props) {
    super(props);
    this.injectedJS =
      "var firebase_token = '" + this.props.firebaseToken + "';" +
      "var iav_token = '" + this.props.IAVToken + "';" +
      "$(function() { generateIAVToken() });";
  }

  handleError(err) {
    console.log("Error loading WebView:", err);
  }

  render() {
    return (
      <WebView
        source={{ uri: 'http://www.getpayper.io/iav' }}
        injectedJavaScript={this.injectedJS}
        startInLoadingState={false}
        onError={err => this.handleError(err)}  />
    );
  }
}
