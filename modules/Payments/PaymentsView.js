import React from 'react';
import { View, Text, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Partial components
import Footer from '../../components/Footer/Footer';
import Transaction from '../../components/Previews/Transaction/Transaction';

// Stylesheets
import colors from '../../styles/colors';

class Payments extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Enable listeners
    var incomingPayments = "paymentFlow/" + this.props.currentUser.uid + "/in/",
        outgoingPayments = "paymentFlow/" + this.props.currentUser.uid + "/out/";
    this.props.listen([incomingPayments, outgoingPayments]);

    // Initialize header
    this.props.setActiveTab(this.props.activeTab);
  }

  componentWillUnmount() {
    // Disable listeners
    this.props.stopListening(this.props.activeFirebaseListeners);
  }


  // TODO: Eric, do your thing here!
  _renderEmptyState() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white}}>
        <Text style={{fontSize: 18, color: colors.darkGrey}}>
          No active{ (this.props.activeTab == "tracking") ? " " + this.props.activeFilter + " " : " " }payments.
        </Text>
      </View>
    );
  }

  _renderPaymentList() {
    // Determine which data source to use for the payment list view
    var ds;
    if (this.props.activeTab == "tracking") {
      ds = (this.props.activeFilter == "incoming") ? this.props.incomingPayments : this.props.outgoingPayments;
    } else if (this.props.tab == "global") {
      ds = this.props.globalPayments;
    }

    // If our data source is not null and has contents, use it to populate the payment list view
    if (ds && ds.getRowCount() > 0) {
      return(
        <View style={{flex: 1.0}}>
          <ListView
            dataSource={ds}
            renderRow={this._renderRow}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />
        </View>
      );
    }
    // Otherwise, return an empty state
    else {
      return this._renderEmptyState();
    }
  }

  _renderRow(payment) {
    return(
      <Transaction
        payment={payment}
        callbackCancel={() => console.log("Cancelling payment")}
        callbackConfirm={() => console.log("Confirming payment")}
        callbackReject={() => console.log("Rejecting payment")} />
    );
  }

  render() {
    return(
      <View style={{flex: 1.0, backgroundColor: colors.white}}>

        { /* List of payments or empty state */ }
        <View style={{flex: 0.9}}>
          { this._renderEmptyState() }
        </View>

        { /* Footer */ }
        <View style={{flex: 0.1}}>
          <Footer
            callbackFeed={() => this.props.setActiveTab('global')}
            callbackTracking={() => this.props.setActiveTab('tracking')}
            callbackPay={() => Actions.CreatePaymentViewContainer()} />
        </View>

      </View>
    );
  }
}

export default Payments;
