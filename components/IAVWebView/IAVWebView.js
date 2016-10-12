// Dependencies
import React from 'react';
import { WebView } from 'react-native';

export default class IAVWebView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      injectedJS: "var firebase_token = '" + this.props.firebaseToken + "';" +
        "var iav_token = '" + this.props.IAVToken + "';" +
        "$(function() { generateIAVToken() });"
    }
    this.WEB_VIEW_REF = "IAVWebView";
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.IAVToken || nextProps.firebaseToken) {
      this.setState({
        injectedJS: "var firebase_token = '" + nextProps.firebaseToken + "';" +
          "var iav_token = '" + nextProps.IAVToken + "';" +
          "$(function() { generateIAVToken() });"
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
