// Dependencies
import React from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';

// Components
import ActivePaymentCard from './PaymentCards/Active';
import ConfirmPaymentCard from './PaymentCards/Confirm';

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
    this.paneCounterIncreasing = true;
    this.maxPaneCounterValue = 5;

    this.state = {
      gradientStartX: 0.0,
      gradientStartY: 0.0,
      gradientEndX: 1.0,
      gradientEndY: 1.0,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.paneCounter = 0;
    this.paneCounterIncreasing = true;
    console.log("DataSource:", nextProps.dataSource);
  }

  _renderSectionHeader(sectionData, sectionTitle) {
    return(
      <View style={{height: 32.5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 20, backgroundColor: colors.paymentListSectionHeaderBackgroundColor, borderColor: colors.paymentListSectionHeaderBorderColor, borderBottomWidth: 0.8}}>
        <Text>{ sectionTitle }</Text>
      </View>
    );
  }

  _renderRow(payment) {
    // Increment paneCounter, which will determine which background color to use
    // for this row
    if (this.paneCounterIncreasing) {
      this.paneCounter++;
      if (this.paneCounter === this.maxPaneCounterValue) this.paneCounterIncreasing = false;
    } else {
      this.paneCounter--;
      if (this.paneCounter === 1) this.paneCounterIncreasing = true;
    }

    if (payment.stage == "pendingConfirmation" && payment.flow == "outgoing")
      return <ConfirmPaymentCard payment={payment} paneCounter={this.paneCounter} reject={() => this.props.removePayment(payment)} />
    else
      return <ActivePaymentCard payment={payment} paneCounter={this.paneCounter} />
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
          colors={['#8BE8CB', '#9e9be2', '#91C4F2']}
          style={gradients.payments} />

        { /* Payments List */ }
        <View style={wrappers.payments}>
          <ListView
            dataSource={this.props.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderSectionHeader={this._renderSectionHeader}
            renderFooter={this._renderFooter.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />} />
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
