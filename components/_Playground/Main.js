// Dependencies
import React from 'react';
import { View, Platform, StyleSheet, Text, Dimensions, Image, TouchableHighlight, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import db from './data';

// Components
import Header from './Header';
import Payments from './Payments';

// Helpers
import * as SetMaster5000 from '../../helpers/SetMaster5000';

// Should we show container borders?
const borders = false;

// Window dimensions
const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: "incoming",
    };
  }

  _handleFilterChange(filter) {
    if (this.state.activeFilter != filter) {
      this.setState({ activeFilter: filter });
    }
  }

  render() {
    return(
      <View style={wrappers.page}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Header */ }
        <View style={wrappers.header}>
          <Header
            activeFilter={this.state.activeFilter}
            handleFilterChange={(filter) => this._handleFilterChange(filter)} />
        </View>

        { /* Page */ }
        <View style={wrappers.content}>
          <Payments
            activeFilter={this.state.activeFilter}
            payments={{
              incoming: SetMaster5000.arrayToMap(db.payments.incoming),
              outgoing: SetMaster5000.arrayToMap(db.payments.outgoing),
            }} />
        </View>
      </View>
    );
  }
};

const wrappers = StyleSheet.create({
  page: {
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: dimensions.width,
    height: dimensions.height,
  },
  header: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    width: dimensions.width,
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'red',
  },
  content: {
    flex: 0.9,
    width: dimensions.width,
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: 'blue',
  }
});

export default Main;
