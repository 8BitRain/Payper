// Dependencies
import React from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Components
import StickyView from '../../../classes/StickyView';
import ContinueButton from '../subcomponents/ContinueButton';
import IAVWebView from '../../../components/IAVWebView/IAVWebView';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class IAV extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.fundingSourceAdded) Actions.MainViewContainer();
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
          <IAVWebView
            currentUser={this.props.currentUser}
            IAVToken={this.props.currentUser.IAVToken}
            firebaseToken={this.props.currentUser.token} />
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
