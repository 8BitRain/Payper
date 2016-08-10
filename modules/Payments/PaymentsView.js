import React from 'react';
import { View, Text, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Alert from '../../helpers/Alert';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

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
            renderRow={this._renderRow.bind(this)}
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
    console.log("%cRendering payment:", "color:green;font-weight:900;");
    console.log(payment);
    return(
      <Transaction
        payment={payment}
        out={this.props.activeFilter == "outgoing"}
        callbackCancel={() => {
          // Define strings to be displayed in alert
          var firstName = payment.recip_name.split(" ")[0],
              purpose = StringMaster5000.formatPurpose(payment.purpose),
              title;

          // Concatenate strings depending on payment flow direction
          if (this.props.currentUser.uid == payment.sender_id) title = "Stop paying " + firstName + " " + purpose;
          else title = firstName + " will stop paying you " + purpose;

          // Alert the user
          Alert.confirmation({
            title: title,
            message: "Are you sure you'd like to cancel this payment?",
            cancelMessage: "Nevermind",
            confirmMessage: "Yes please",
            cancel: () => console.log("Nevermind"),
            confirm: () => this.props.cancelPayment({
              pid: payment.pid,
              token: this.props.currentUser.token,
              ds: (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
            })
          });
        }}
        callbackConfirm={() => {
          console.log("Confirming payment");
          var firstName = payment.sender_name.split(" ")[0],
              purpose = StringMaster5000.formatPurpose(payment.purpose);

          // Determine which DataSource to pass to confirm function for instant re-render
          var ds = (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments;

          // Alert the user
          Alert.confirmation({
            title: "Start paying " + firstName + " " + purpose,
            message: "You may cancel this payment at any time. Would you like to continue?",
            cancelMessage: "Nevermind",
            confirmMessage: "Yes please",
            cancel: () => console.log("Nevermind"),
            confirm: () => this.props.cancelPayment({
              pid: payment.pid,
              token: this.props.currentUser.token,
              ds: (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
            })
          });
        }}
        callbackReject={() => console.log("Rejecting payment")} />
    );
  }

  render() {
    return(
      <View style={{flex: 1.0, backgroundColor: colors.white}}>

        { /* List of payments or empty state */ }
        <View style={{flex: 0.9}}>
          { this._renderPaymentList() }
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
