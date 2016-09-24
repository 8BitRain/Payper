// Dependencies
import React from 'react';
import { View, ListView, DataSource, Platform, StyleSheet, Text, Dimensions, Image, TouchableHighlight, StatusBar } from 'react-native';
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

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.outgoingPaymentsMap = SetMaster5000.filterPayments(db.payments.outgoing);
    this.incomingPaymentsMap = SetMaster5000.filterPayments(db.payments.incoming);

    this.state = {
      activeFilter: "incoming",
      outgoingDataSource: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(this.outgoingPaymentsMap),
      incomingDataSource: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(this.incomingPaymentsMap),
    };
  }

  _handleFilterChange(filter) {
    if (this.state.activeFilter != filter) {
      this.setState({ activeFilter: filter });
    }
  }

  _removePayment(p) {
    var payments = (p.flow == "outgoing") ? this.outgoingPaymentsMap : this.incomingPaymentsMap;

    // If this is the last payment in its section, just delete the entire section
    // if (payments[p.sectionTitle].length === 1) {
    //   delete payments[p.sectionTitle];
    //   console.log("New data source:", this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(payments));
    //   if (p.flow == "outgoing") this.setState({ outgoingDataSource: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(payments) });
    //   else if (p.flow == "incoming") this.setState({ incomingDataSource: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(payments) });
    //   return;
    // }

    // Recalculate number of payments in this section
    var regex = /\(([^)]+)\)/;
    var newNumPayments = regex.exec(p.sectionTitle)[1] - 1;
    var newSectionTitle = p.sectionTitle.replace(/\(.*?\)/, "(" + newNumPayments + ")");
    // TODO: Find out how to rename keys in a nested JSON structure

    // Remove the payment from its section
    var i = payments[p.sectionTitle].indexOf(p);
    payments[p.sectionTitle].splice(i, 1);
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
            removePayment={(p) => this._removePayment(p)}
            dataSources={{ incoming: this.state.incomingDataSource, outgoing: this.state.outgoingDataSource }} />
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
