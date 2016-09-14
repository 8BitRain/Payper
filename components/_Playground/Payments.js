// Dependencies
import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';

// Components
import PaymentCard from './PaymentCard';

// Should we show container borders?
const borders = false;

// Window dimensions
const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

class Payments extends React.Component {
  constructor(props) {
    super(props);

    this.paneCounter = 0;
    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.state = {
      gradientStartX: 0.0,
      gradientStartY: 0.0,
      gradientEndX: 1.0,
      gradientEndY: 1.0,
      activeFilter: this.props.activeFilter,
      dataSource:
        (this.props.activeFilter == "incoming")
        ? this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(this.props.payments.incoming)
        : this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(this.props.payments.outgoing),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeFilter != this.state.activeFilter) {
      this.setState({
        dataSource:
          (nextProps.activeFilter == "incoming")
          ? this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(nextProps.payments.incoming)
          : this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(nextProps.payments.outgoing),
        activeFilter: nextProps.activeFilter,
      });
    }
  }

  _renderSectionHeader(sectionData, sectionTitle) {
    return(
      <View style={{height: 30, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, paddingLeft: 20, backgroundColor: "rgba(255, 255, 255, 0.5)"}}>
        <Text>{ sectionTitle }</Text>
      </View>
    );
  }

  _renderRow(payment) {
    // Increment paneCounter, which will determine which background color to use
    // for this row
    if (this.paneCounter === 3) this.paneCounter = 1;
    else this.paneCounter++;

    return(
      <PaymentCard
        payment={payment}
        paneCounter={this.paneCounter} />
    );
  }

  _renderFooter() {
    return(
      <View style={{ flex: 1.0, height: 130, backgroundColor: 'transparent' }} />
    );
  }

  render() {
    return(
      <View style={wrappers.page}>

        { /* Background Gradient */ }
        <LinearGradient
          start={[this.state.gradientStartX, this.state.gradientStartY]} end={[this.state.gradientEndX, this.state.gradientEndY]}
          locations={[0,1,0]}
          colors={['#8BE8CB', '#8783D1', '#91C4F2']}
          style={gradients.payments} />

        { /* Payments List */ }
        <View style={wrappers.payments}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderSectionHeader={this._renderSectionHeader}
            renderFooter={this._renderFooter.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />
        </View>


      </View>
    );
  }
};

const wrappers = StyleSheet.create({
  page: {
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: dimensions.width,
    height: dimensions.height,
  },
  payments: {
    flex: 1.0,
  },
});

const gradients = StyleSheet.create({
  payments: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Payments;
