// Dependencies
import React from 'react';
import { View, Text, StyleSheet, WebView, Dimensions } from 'react-native';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class IAV extends React.Component {
  constructor(props) {
    super(props);
    this.injectedJS =
      "var firebase_token = '" + this.props.currentUser.token + "';" +
      "var iav_token = '" + this.props.currentUser.iavToken + "';" +
      "$(function() { generateIAVToken() });";
  }

  handleError(err) {
    console.log("Error loading WebView:", err);
  }

  render() {

    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 24, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "Link your bank account" }
          </Text>
        </View>

        <View style={{ marginTop: 18, borderTopWidth: 1.5, borderColor: colors.accent, flex: 1.0 }}>
          <WebView
            source={{ uri: 'http://www.getpayper.io/iav' }}
            injectedJavaScript={this.injectedJS}
            startInLoadingState={false}
            onError={err => this.handleError(err)}  />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.richBlack
  }
});
